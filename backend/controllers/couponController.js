import Coupon from '../models/Coupon.js';
import { readDb, writeDb } from '../utils/jsonDb.js';

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  const { code, cartAmount } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  const uppercaseCode = code.toUpperCase();

  // 1. Try Mongo DB
  if (process.env.MONGODB_URI) {
    try {
      const coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });
      if (!coupon) {
        return res.status(404).json({ message: 'Invalid coupon code or coupon is expired/inactive' });
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ message: 'Coupon has expired' });
      }

      if (cartAmount < coupon.minCartAmount) {
        return res.status(400).json({ message: `Minimum cart value of $${coupon.minCartAmount} required` });
      }

      return res.json({
        success: true,
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        minCartAmount: coupon.minCartAmount
      });
    } catch (error) {
      console.error('Mongo coupon check failed, using fallback:', error);
    }
  }

  // 2. Fallback local JSON DB
  const db = readDb();
  if (!db.coupons) {
    db.coupons = [
      { id: 'c1', code: 'WELCOME10', discountType: 'percentage', discountAmount: 10, minCartAmount: 100, expiryDate: '2030-12-31', isActive: true },
      { id: 'c2', code: 'SUPER50', discountType: 'flat', discountAmount: 50, minCartAmount: 500, expiryDate: '2030-12-31', isActive: true }
    ];
    writeDb(db);
  }

  const coupon = db.coupons.find(c => c.code === uppercaseCode && c.isActive);
  if (!coupon) {
    return res.status(404).json({ message: 'Invalid coupon code' });
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return res.status(400).json({ message: 'Coupon has expired' });
  }

  if (cartAmount < coupon.minCartAmount) {
    return res.status(400).json({ message: `Minimum cart value of $${coupon.minCartAmount} required` });
  }

  return res.json({
    success: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount: coupon.discountAmount,
    minCartAmount: coupon.minCartAmount
  });
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  if (process.env.MONGODB_URI) {
    try {
      const coupons = await Coupon.find({});
      return res.json(coupons);
    } catch (error) {
      console.error(error);
    }
  }

  const db = readDb();
  if (!db.coupons) db.coupons = [];
  res.json(db.coupons);
};

// @desc    Create new coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const { code, discountType, discountAmount, minCartAmount, expiryDate } = req.body;

  if (process.env.MONGODB_URI) {
    try {
      const newCoupon = await Coupon.create({
        code: code.toUpperCase(),
        discountType,
        discountAmount,
        minCartAmount,
        expiryDate
      });
      return res.status(201).json(newCoupon);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  const db = readDb();
  if (!db.coupons) db.coupons = [];

  const couponExists = db.coupons.some(c => c.code === code.toUpperCase());
  if (couponExists) {
    return res.status(400).json({ message: 'Coupon already exists' });
  }

  const newCoupon = {
    id: `coupon-${Date.now()}`,
    code: code.toUpperCase(),
    discountType,
    discountAmount,
    minCartAmount,
    expiryDate,
    isActive: true
  };

  db.coupons.push(newCoupon);
  writeDb(db);
  res.status(201).json(newCoupon);
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  if (process.env.MONGODB_URI) {
    try {
      const coupon = await Coupon.findById(id);
      if (coupon) {
        await coupon.deleteOne();
        return res.json({ message: 'Coupon removed' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const db = readDb();
  if (!db.coupons) db.coupons = [];
  
  const index = db.coupons.findIndex(c => c.id === id || (c._id && c._id.toString() === id));
  if (index !== -1) {
    db.coupons.splice(index, 1);
    writeDb(db);
    return res.json({ message: 'Coupon removed from local DB' });
  }

  res.status(404).json({ message: 'Coupon not found' });
};
