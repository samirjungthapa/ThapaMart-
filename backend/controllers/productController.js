import Product from '../models/Product.js';
import { readDb, writeDb } from '../utils/jsonDb.js';

// @desc    Get all products with filters & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 8 } = req.query;

  if (process.env.MONGODB_URI) {
    try {
      const query = {};
      if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
      }
      if (category && category !== 'all') {
        const categoriesArray = category.split(',').map(c => c.trim().toLowerCase());
        query.category = { $in: categoriesArray };
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let apiQuery = Product.find(query);

      if (sort === 'priceAsc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'priceDesc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ ratings: -1 });
      } else {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      }

      const total = await Product.countDocuments(query);
      const products = await apiQuery.skip((Number(page) - 1) * Number(limit)).limit(Number(limit));

      return res.json({
        products,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  let filteredProducts = [...db.products];

  if (keyword) {
    filteredProducts = filteredProducts.filter(p =>
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  if (category && category !== 'all') {
    const categoriesArray = category.split(',').map(c => c.trim().toLowerCase());
    filteredProducts = filteredProducts.filter(p => categoriesArray.includes(p.category.toLowerCase()));
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
  }

  if (sort === 'priceAsc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'priceDesc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filteredProducts.sort((a, b) => b.ratings - a.ratings);
  } else {
    // Default newest (none for mock unless it has created timestamp, or just keep original order/reverse)
    filteredProducts.reverse();
  }

  const total = filteredProducts.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + Number(limit));

  res.json({
    products: paginatedProducts,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total
  });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (process.env.MONGODB_URI) {
    try {
      const product = await Product.findById(id);
      if (product) return res.json(product);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const product = db.products.find(p => p.id === id || (p._id && p._id.toString() === id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { title, description, category, price, stock, images } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const product = new Product({
        title,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        images: images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
      });
      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const newProduct = {
    id: `prod-${Date.now()}`,
    title,
    description,
    category,
    price: Number(price),
    stock: Number(stock),
    images: images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    ratings: 0,
    reviews: []
  };

  db.products.push(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, price, stock, images } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const product = await Product.findById(id);
      if (product) {
        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.price = price !== undefined ? Number(price) : product.price;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        product.images = images || product.images;

        const updatedProduct = await product.save();
        return res.json(updatedProduct);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const index = db.products.findIndex(p => p.id === id || (p._id && p._id.toString() === id));
  if (index !== -1) {
    const product = db.products[index];
    db.products[index] = {
      ...product,
      title: title || product.title,
      description: description || product.description,
      category: category || product.category,
      price: price !== undefined ? Number(price) : product.price,
      stock: stock !== undefined ? Number(stock) : product.stock,
      images: images || product.images
    };
    writeDb(db);
    return res.json(db.products[index]);
  }

  res.status(404).json({ message: 'Product not found' });
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (process.env.MONGODB_URI) {
    try {
      const product = await Product.findById(id);
      if (product) {
        await product.deleteOne();
        return res.json({ message: 'Product removed' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const index = db.products.findIndex(p => p.id === id || (p._id && p._id.toString() === id));
  if (index !== -1) {
    db.products.splice(index, 1);
    writeDb(db);
    return res.json({ message: 'Product removed' });
  }

  res.status(404).json({ message: 'Product not found' });
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const product = await Product.findById(id);
      if (product) {
        const alreadyReviewed = product.reviews.find(
          r => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
          return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id
        };

        product.reviews.push(review);
        product.ratings =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;

        await product.save();
        return res.status(201).json({ message: 'Review added' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const index = db.products.findIndex(p => p.id === id || (p._id && p._id.toString() === id));
  if (index !== -1) {
    const product = db.products[index];
    const userId = req.user.id || req.user._id.toString();

    const alreadyReviewed = product.reviews.find(r => r.user === userId);
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      id: `rev-${Date.now()}`,
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: userId,
      createdAt: new Date().toISOString()
    };

    product.reviews.push(review);
    product.ratings = Number(
      (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1)
    );

    db.products[index] = product;
    writeDb(db);
    return res.status(201).json({ message: 'Review added' });
  }

  res.status(404).json({ message: 'Product not found' });
};
