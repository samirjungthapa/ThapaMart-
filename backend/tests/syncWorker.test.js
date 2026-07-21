import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { syncOfflineData } from '../utils/syncWorker.js';
import * as jsonDb from '../utils/jsonDb.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

vi.mock('../utils/jsonDb.js', () => ({
  readDb: vi.fn()
}));

vi.mock('../models/Product.js', () => {
  return {
    default: {
      findOne: vi.fn(),
      create: vi.fn()
    }
  };
});

vi.mock('../models/User.js', () => {
  return {
    default: {
      findOne: vi.fn(),
      create: vi.fn()
    }
  };
});

vi.mock('../models/Order.js', () => {
  return {
    default: {
      findOne: vi.fn(),
      create: vi.fn()
    }
  };
});

vi.mock('../models/Coupon.js', () => {
  return {
    default: {
      findOne: vi.fn(),
      create: vi.fn()
    }
  };
});

describe('syncWorker - syncOfflineData', () => {
  const originalEnv = process.env.MONGODB_URI;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.MONGODB_URI = originalEnv;
  });

  it('should skip synchronization if MONGODB_URI is missing', async () => {
    delete process.env.MONGODB_URI;
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await syncOfflineData();
    
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping synchronization')
    );
    logSpy.mockRestore();
  });

  it('should attempt syncing products and users when database is set', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    
    const mockDb = {
      products: [
        { id: 'mock-1', title: 'Offline Test Item', price: 999, stock: 5 }
      ],
      users: [
        { email: 'user@thapa.com', name: 'Tester', password: 'xyz' }
      ],
      orders: [],
      coupons: []
    };
    
    jsonDb.readDb.mockReturnValue(mockDb);
    Product.findOne.mockResolvedValue(null); // not yet in mongo
    User.findOne.mockResolvedValue(null); // not yet in mongo
    
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await syncOfflineData();

    expect(Product.findOne).toHaveBeenCalled();
    expect(Product.create).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Offline Test Item',
      price: 999
    }));
    
    expect(User.findOne).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'user@thapa.com'
    }));

    logSpy.mockRestore();
  });
});
