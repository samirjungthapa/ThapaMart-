import Product from '../models/Product.js';
import { readDb } from '../utils/jsonDb.js';

// @desc    Get product recommendations based on user preference or high ratings
// @route   GET /api/products/recommendations
// @access  Public
export const getRecommendations = async (req, res) => {
  const { categories } = req.query; // Comma separated categories user recently visited

  let preferredCategories = [];
  if (categories) {
    preferredCategories = categories.split(',').map(c => c.trim().toLowerCase());
  }

  if (process.env.MONGODB_URI) {
    try {
      let query = {};
      if (preferredCategories.length > 0) {
        query.category = { $in: preferredCategories };
      }

      // Get up to 6 products
      let recommendations = await Product.find(query).sort({ ratings: -1 }).limit(6);
      
      // If we don't have enough, fill up with general top products
      if (recommendations.length < 4) {
        const extraProducts = await Product.find({ _id: { $nin: recommendations.map(r => r._id) } })
          .sort({ ratings: -1 })
          .limit(6 - recommendations.length);
        recommendations = [...recommendations, ...extraProducts];
      }

      return res.json({ recommendations });
    } catch (error) {
      console.error("MongoDB recommendations error:", error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  let recommendations = [];
  if (preferredCategories.length > 0) {
    recommendations = db.products.filter(p => p.category && preferredCategories.includes(p.category.toLowerCase()));
  }

  // Sort by rating or discount
  recommendations.sort((a, b) => (b.ratings || b.rating || 0) - (a.ratings || a.rating || 0));
  recommendations = recommendations.slice(0, 6);

  if (recommendations.length < 4) {
    const existingIds = new Set(recommendations.map(r => r.id));
    const extra = db.products
      .filter(p => !existingIds.has(p.id))
      .sort((a, b) => (b.ratings || b.rating || 0) - (a.ratings || a.rating || 0))
      .slice(0, 6 - recommendations.length);
    recommendations = [...recommendations, ...extra];
  }

  return res.json({ recommendations });
};
