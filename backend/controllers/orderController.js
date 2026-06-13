import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { readDb, writeDb } from '../utils/jsonDb.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    billingInfo,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  if (process.env.MONGODB_URI) {
    try {
      const order = new Order({
        user: req.user._id,
        products: orderItems.map(x => ({
          product: x.product,
          title: x.title,
          price: x.price,
          quantity: x.quantity,
          image: x.image
        })),
        shippingAddress,
        billingInfo,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const newOrder = {
    id: `ord-${Date.now()}`,
    user: req.user.id || req.user._id.toString(),
    products: orderItems.map(x => ({
      product: x.product,
      title: x.title,
      price: x.price,
      quantity: x.quantity,
      image: x.image
    })),
    shippingAddress,
    billingInfo,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDb(db);
  res.status(201).json(newOrder);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (process.env.MONGODB_URI) {
    try {
      const order = await Order.findById(id).populate('user', 'name email');
      if (order) return res.json(order);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const order = db.orders.find(o => o.id === id || (o._id && o._id.toString() === id));
  if (order) {
    const user = db.users.find(u => u.id === order.user || (u._id && u._id.toString() === order.user));
    res.json({
      ...order,
      user: user ? { name: user.name, email: user.email } : { name: 'Anonymous', email: 'anon@thapamart.com' }
    });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order payment status to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  const { id } = req.params;
  const { id: stripeId, status } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const order = await Order.findById(id);
      if (order) {
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Processing';
        order.stripePaymentIntentId = stripeId;
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const index = db.orders.findIndex(o => o.id === id || (o._id && o._id.toString() === id));
  if (index !== -1) {
    db.orders[index].paymentStatus = 'Paid';
    db.orders[index].orderStatus = 'Processing';
    db.orders[index].stripePaymentIntentId = stripeId;
    writeDb(db);
    return res.json(db.orders[index]);
  }

  res.status(404).json({ message: 'Order not found' });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  const userId = req.user.id || req.user._id.toString();

  if (process.env.MONGODB_URI) {
    try {
      const orders = await Order.find({ user: req.user._id });
      return res.json(orders);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const orders = db.orders.filter(o => o.user === userId);
  res.json(orders);
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  if (process.env.MONGODB_URI) {
    try {
      const orders = await Order.find({}).populate('user', 'id name');
      return res.json(orders);
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const ordersWithUsernames = db.orders.map(o => {
    const user = db.users.find(u => u.id === o.user || (u._id && u._id.toString() === o.user));
    return {
      ...o,
      user: user ? { id: user.id, name: user.name } : { id: 'anon', name: 'Anonymous' }
    };
  });
  res.json(ordersWithUsernames);
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const order = await Order.findById(id);
      if (order) {
        order.orderStatus = status;
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fallback to JSON DB
  const db = readDb();
  const index = db.orders.findIndex(o => o.id === id || (o._id && o._id.toString() === id));
  if (index !== -1) {
    db.orders[index].orderStatus = status;
    writeDb(db);
    return res.json(db.orders[index]);
  }

  res.status(404).json({ message: 'Order not found' });
};
