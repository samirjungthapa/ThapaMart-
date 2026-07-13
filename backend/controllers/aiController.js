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
  const { fileName, category, image } = req.body;
  
  let queryText = category || 'shoes';

  const apiKey = process.env.GEMINI_API_KEY;
  if (image && apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const imagePart = {
        inlineData: {
          data: image.split(',')[1] || image,
          mimeType: 'image/jpeg'
        }
      };

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
  if (!image || queryText === (category || 'shoes')) {
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
