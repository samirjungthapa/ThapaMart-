import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product.js';
import { readDb } from '../utils/jsonDb.js';

// Heuristic fallback matching for search
const findLocalMatches = async (queryText) => {
  const keyword = queryText.toLowerCase();
  
  if (process.env.MONGODB_URI) {
    try {
      const dbMatches = await Product.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } }
        ]
      }).limit(5);
      if (dbMatches.length > 0) return dbMatches;
    } catch (e) {
      console.warn("DB search failed, falling back to JSON DB", e);
    }
  }

  // JSON DB Fallback
  const db = readDb();
  return db.products.filter(p =>
    (p.title && p.title.toLowerCase().includes(keyword)) ||
    (p.description && p.description.toLowerCase().includes(keyword)) ||
    (p.category && p.category.toLowerCase().includes(keyword))
  ).slice(0, 5);
};

// @desc    Analyze user request and recommend products using Gemini or smart fallback
// @route   POST /api/ai/chat
// @access  Public
export const handleAiChat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // 1. Fetch matching products locally to inject into AI context (RAG pattern!)
  const localMatches = await findLocalMatches(message);
  const productsContext = localMatches.map(p => 
    `- ID: ${p._id || p.id}, Name: ${p.title || p.name}, Category: ${p.category}, Price: $${p.price}, Rating: ${p.ratings || p.rating || 'N/A'}`
  ).join('\n');

  // 2. Check if Gemini API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemInstruction = `You are the ThapaMart Personal Stylist and Shopping Assistant. 
You assist customers in finding premium products, matching outfits, and answering catalog questions.
Always respond in a helpful, elegant, luxury-brand tone.
Here are the products currently in our inventory that might match the user's prompt:
${productsContext || "No exact product matches found in catalog."}

If matching products are available, guide the user to check them out. Format product recommendations clearly.`;

      const prompt = `User request: ${message}\n\nChat History: ${JSON.stringify(history)}`;
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemInstruction + "\n\n" + prompt }] }]
      });

      const responseText = result.response.text();
      return res.json({
        reply: responseText,
        recommendedProducts: localMatches
      });
    } catch (error) {
      console.error("Gemini API error, using smart fallback:", error);
    }
  }

  // Heuristic fallbacks when Gemini is not configured or fails
  let reply = `I've analyzed our Premium collection for your request. `;
  if (localMatches.length > 0) {
    reply += `Here are the matching premium pieces I found for you. Let me know if you would like me to style any of these!`;
  } else {
    reply += `I couldn't find any direct matches in our catalog for "${message}", but check out our collections or try describing what you're looking for (e.g., "shoes", "jacket", "watch").`;
  }

  return res.json({
    reply,
    recommendedProducts: localMatches
  });
};

// @desc    Analyze uploaded image or filename to perform visual search
// @route   POST /api/ai/visual-search
// @access  Public
export const handleVisualSearch = async (req, res) => {
  const { category, image } = req.body || {};
  let fileName = req.body?.fileName || (req.file ? req.file.originalname : '');
  
  let queryText = category || 'shoes';

  const apiKey = process.env.GEMINI_API_KEY;
  const hasUploadedFile = req.file;
  const hasBase64Image = image;

  if ((hasUploadedFile || hasBase64Image) && apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let imagePart;
      if (hasUploadedFile) {
        imagePart = {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype
          }
        };
      } else {
        imagePart = {
          inlineData: {
            data: image.split(',')[1] || image,
            mimeType: 'image/jpeg'
          }
        };
      }

      const prompt = "Analyze this image and identify the main consumer product category or product name (e.g. shoes, watch, clothing, electronics, bag). Respond with ONLY the category/keyword in 1-2 words so we can search a database with it.";
      
      const result = await model.generateContent([prompt, imagePart]);
      const resultText = result.response.text().trim().toLowerCase();
      
      if (resultText) {
        queryText = resultText.replace(/[^\w\s]/gi, '');
        console.log(`🤖 Gemini Multimodal identified visual search category: "${queryText}"`);
      }
    } catch (error) {
      console.error("Gemini Multimodal Visual Search failed, falling back to heuristics:", error);
    }
  }

  // Fallback to name-based classification if needed
  if (!hasUploadedFile && (!image || queryText === (category || 'shoes'))) {
    if (fileName) {
      const lowerName = fileName.toLowerCase();
      if (lowerName.includes('watch')) queryText = 'watch';
      else if (lowerName.includes('shoe') || lowerName.includes('sneaker') || lowerName.includes('boot')) queryText = 'shoes';
      else if (lowerName.includes('shirt') || lowerName.includes('tshirt') || lowerName.includes('cloth')) queryText = 'clothing';
      else if (lowerName.includes('phone') || lowerName.includes('headphone') || lowerName.includes('gadget')) queryText = 'electronics';
    }
  }

  const matches = await findLocalMatches(queryText);
  return res.json({
    message: `Visual search processed. Identified visual category: "${queryText}". Here are the matching premium items:`,
    recommendedProducts: matches
  });
};

// @desc    Suggest descriptions, prices, and discounts based on product title using Gemini
// @route   POST /api/ai/suggest-metadata
// @access  Private/Admin
export const handleSuggestMetadata = async (req, res) => {
  const { title, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Product title is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a product management assistant at ThapaMart. Given the product title "${title}" and category "${category || 'general'}", generate:
1. A luxury brand style description (1-2 sentences).
2. A suggested retail price in Nepalese Rupees (Rs. value, integer between 500 and 300000).
3. A suggested promotional discount percentage (integer between 0 and 50).

Respond with ONLY a valid raw JSON object matching this schema (do not wrap in markdown blocks, do not add any explanation or backticks):
{
  "description": "product description here",
  "suggestedPrice": 12000,
  "discountPercent": 10
}`;

      const result = await model.generateContent(prompt);
      let rawText = result.response.text().trim();
      
      // Clean JSON in case model wrapped it in markdown code blocks
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }

      const metadata = JSON.parse(rawText);

      return res.json({
        success: true,
        description: metadata.description || '',
        price: metadata.suggestedPrice || 15000,
        discountPercent: metadata.discountPercent || 0
      });
    } catch (error) {
      console.error("Gemini metadata generation failed, using fallback:", error);
    }
  }

  // Local static fallback
  const mockDescriptions = [
    `Experience the premium quality and refined craftsmanship of our newly cataloged ${title}. Built to elevate your lifestyle.`,
    `A signature statement piece, the new ${title} blends timeless aesthetics with modern practicality.`,
    `Crafted from curated materials, the ${title} delivers outstanding durability and unmatched premium style.`
  ];
  const randomDesc = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];

  return res.json({
    success: true,
    description: randomDesc,
    price: 45000,
    discountPercent: 15,
    isMock: true
  });
};
