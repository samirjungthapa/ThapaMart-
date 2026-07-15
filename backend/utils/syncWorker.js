import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { readDb } from './jsonDb.js';

export const syncOfflineData = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️ Sync Worker: No MongoDB URI configured. Skipping synchronization.');
    return;
  }

  try {
    console.log('🔄 Sync Worker: Initiating database reconciliation...');
    const db = readDb();

    // 1. Sync Products
    if (db.products && db.products.length > 0) {
      for (const localProduct of db.products) {
        const mongoProduct = await Product.findOne({
          $or: [
            { _id: localProduct.id && localProduct.id.match(/^[0-9a-fA-F]{24}$/) ? localProduct.id : null },
            { title: localProduct.title }
          ].filter(Boolean)
        });

        if (!mongoProduct) {
          console.log(`➕ Syncing product: ${localProduct.title}`);
          await Product.create({
            title: localProduct.title,
            description: localProduct.description || 'No description provided.',
            category: localProduct.category || 'general',
            price: Number(localProduct.price || 0),
            stock: Number(localProduct.stock || 0),
            images: localProduct.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
            discountPercent: Number(localProduct.discountPercent || 0),
            ratings: Number(localProduct.ratings || 0),
            reviews: localProduct.reviews || []
          });
        } else {
          // Sync stock and price back up if different
          let changed = false;
          if (mongoProduct.stock !== localProduct.stock) {
            mongoProduct.stock = localProduct.stock;
            changed = true;
          }
          if (mongoProduct.price !== localProduct.price) {
            mongoProduct.price = localProduct.price;
            changed = true;
          }
          if (changed) {
            await mongoProduct.save();
          }
        }
      }
    }

    // 2. Sync Users
    if (db.users && db.users.length > 0) {
      for (const localUser of db.users) {
        const exists = await User.findOne({ email: localUser.email });
        if (!exists) {
          console.log(`➕ Syncing user: ${localUser.email}`);
          await User.create({
            name: localUser.name,
            email: localUser.email,
            password: localUser.password, // already hashed
            phone: localUser.phone || '',
            role: localUser.role || 'customer',
            isVerified: localUser.isVerified !== undefined ? localUser.isVerified : true,
            avatar: localUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          });
        }
      }
    }

    console.log('✅ Sync Worker: Database synchronization completed successfully.');
  } catch (error) {
    console.error('❌ Sync Worker: Synchronization failed:', error.message);
  }
};

// Auto-run scheduler every 60 seconds
export const startSyncScheduler = () => {
  console.log('⚙️ Sync Worker: Background synchronization scheduler started.');
  setInterval(syncOfflineData, 60000);
};
