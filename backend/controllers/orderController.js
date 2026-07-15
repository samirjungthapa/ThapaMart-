import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { readDb, writeDb } from '../utils/jsonDb.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateInvoicePdfBuffer } from '../utils/invoiceGenerator.js';

const triggerOrderEmail = async (order, user, type = 'Created') => {
  if (!user || !user.email) return;

  const itemsListText = order.products
    .map(p => `- ${p.title} x ${p.quantity} (Rs. ${p.price.toLocaleString()})`)
    .join('\n');

  const itemsListHtml = order.products
    .map(
      p => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; font-size: 14px; color: #374151;">${p.title}</td>
        <td style="padding: 12px; font-size: 14px; color: #374151; text-align: center;">${p.quantity}</td>
        <td style="padding: 12px; font-size: 14px; color: #374151; text-align: right;">Rs. ${Number(p.price).toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const subject = type === 'Created' 
    ? `ThapaMart Order Confirmation - Order #${order.id || order._id}`
    : `ThapaMart Payment Confirmed - Order #${order.id || order._id}`;

  const text = `
Dear ${user.name || 'Valued Customer'},

Thank you for shopping at ThapaMart!

Your order details:
Order Reference: ${order.id || order._id}
Payment Status: ${order.paymentStatus}
Order Status: ${order.orderStatus}

Items Ordered:
${itemsListText}

Total Price: Rs. ${Number(order.totalPrice).toLocaleString()}

Shipping Address:
${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}

We will notify you once your order is processed and shipped.

Warm regards,
ThapaMart Customer Support
  `;

  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; background-color: #FFFFFF;">
      <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 20px;">
        <h2 style="margin: 0; color: #000000; letter-spacing: 1px;">THAPAMART</h2>
        <span style="font-size: 12px; color: #6B7280; text-transform: uppercase;">Premium E-Commerce Platform</span>
      </div>
      
      <div style="padding: 20px 0;">
        <h3 style="color: #111827; margin-top: 0;">Order Receipt Confirmation</h3>
        <p style="font-size: 14px; color: #4B5563; line-height: 1.5;">
          Dear <strong>${user.name || 'Valued Customer'}</strong>,<br/><br/>
          Thank you for choosing ThapaMart. Your order has been registered successfully.
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #F9FAFB; border-bottom: 2px solid #E5E7EB;">
              <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase;">Item</th>
              <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase;">Qty</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #374151; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #F9FAFB; border-radius: 8px; font-size: 14px; color: #374151;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Payment Method:</strong> ${order.paymentMethod}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Total Amount:</strong> Rs. ${Number(order.totalPrice).toLocaleString()}</span>
          </div>
          <div style="margin-top: 8px;">
            <strong>Shipping Address:</strong><br/>
            ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}
          </div>
        </div>
      </div>
      
      <div style="text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 12px; color: #9CA3AF;">
        <p>This is an automated transactional email from ThapaMart. Please do not reply directly.</p>
        <p>&copy; 2026 ThapaMart Inc. All rights reserved.</p>
      </div>
    </div>
  `;

  let attachments = [];
  if (type === 'Paid') {
    try {
      const pdfBuffer = await generateInvoicePdfBuffer(order, user);
      attachments.push({
        filename: `invoice_${order.id || order._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    } catch (pdfErr) {
      console.error('⚠️ Failed to generate invoice PDF:', pdfErr.message);
    }
  }

  try {
    await sendEmail({ to: user.email, subject, html, text, attachments });
  } catch (err) {
    console.error('⚠️ Failed to trigger email notification:', err.message);
  }
};

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

      // Decrement stock levels and broadcast updates
      for (const item of orderItems) {
        const productObj = await Product.findById(item.product);
        if (productObj) {
          productObj.stock = Math.max(0, productObj.stock - item.quantity);
          await productObj.save();
          const broadcast = req.app.get('broadcastEvent');
          if (broadcast) {
            broadcast('PRODUCT_UPDATED', productObj);
          }
        }
      }

      triggerOrderEmail(createdOrder, req.user, 'Created');
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

  // Decrement stock levels and broadcast updates in fallback mode
  for (const item of orderItems) {
    const productIdx = db.products.findIndex(p => p.id === item.product || (p._id && p._id.toString() === item.product));
    if (productIdx !== -1) {
      db.products[productIdx].stock = Math.max(0, db.products[productIdx].stock - item.quantity);
      const broadcast = req.app.get('broadcastEvent');
      if (broadcast) {
        broadcast('PRODUCT_UPDATED', db.products[productIdx]);
      }
    }
  }

  db.orders.push(newOrder);
  writeDb(db);
  triggerOrderEmail(newOrder, req.user, 'Created');
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
      const order = await Order.findById(id).populate('user');
      if (order) {
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Processing';
        order.stripePaymentIntentId = stripeId;
        const updatedOrder = await order.save();
        triggerOrderEmail(updatedOrder, order.user, 'Paid');
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
    const user = db.users.find(u => u.id === db.orders[index].user || (u._id && u._id.toString() === db.orders[index].user));
    triggerOrderEmail(db.orders[index], user || req.user, 'Paid');
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
        
        const broadcast = req.app.get('broadcastEvent');
        if (broadcast) {
          broadcast('ORDER_UPDATED', updatedOrder);
        }
        
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
    
    const broadcast = req.app.get('broadcastEvent');
    if (broadcast) {
      broadcast('ORDER_UPDATED', db.orders[index]);
    }
    
    return res.json(db.orders[index]);
  }

  res.status(404).json({ message: 'Order not found' });
};
