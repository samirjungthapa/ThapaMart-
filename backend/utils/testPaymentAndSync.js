import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from './jsonDb.js';
import { syncOfflineData } from './syncWorker.js';
import { stripeWebhook } from '../controllers/paymentController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/db.json');
const BACKUP_FILE = path.join(__dirname, '../data/db.backup.json');

// Mock response object builder
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  res.send = (msg) => {
    res.body = msg;
    return res;
  };
  return res;
};

const runIntegrationTests = async () => {
  console.log('🧪 Starting Payment and Offline Database Integration Tests...');
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ Passed: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ Failed: ${message}`);
      failed++;
    }
  };

  // 1. Backup existing DB file
  let dbBackupExists = false;
  if (fs.existsSync(DB_FILE)) {
    fs.copyFileSync(DB_FILE, BACKUP_FILE);
    dbBackupExists = true;
  }

  try {
    // 2. Setup mock local offline DB data
    const mockDbData = {
      users: [
        {
          id: 'mock-user-1',
          name: 'Offline Test User',
          email: 'offline@thapamart.com',
          password: 'hashedpassword123',
          phone: '+1234567890',
          role: 'customer',
          isVerified: true
        }
      ],
      products: [
        {
          id: 'mock-prod-1',
          title: 'Offline Super Phone 2026',
          price: 150000,
          stock: 10,
          category: 'electronics'
        }
      ],
      orders: [
        {
          id: 'mock-order-1',
          user: 'mock-user-1',
          products: [
            {
              product: 'mock-prod-1',
              title: 'Offline Super Phone 2026',
              price: 150000,
              quantity: 2
            }
          ],
          shippingAddress: {
            address: '123 Offline St',
            city: 'Kathmandu',
            postalCode: '44600',
            country: 'Nepal'
          },
          totalPrice: 300000,
          taxPrice: 0,
          shippingPrice: 0,
          paymentMethod: 'Stripe',
          paymentStatus: 'Pending',
          orderStatus: 'Pending'
        }
      ],
      coupons: [
        {
          code: 'TESTCOUPON50',
          discountType: 'percentage',
          discountAmount: 50,
          isActive: true
        }
      ]
    };

    writeDb(mockDbData);
    assert(fs.existsSync(DB_FILE), 'JSON database file is written successfully');

    // Test JSON database reading
    const readData = readDb();
    assert(readData.users[0].email === 'offline@thapamart.com', 'Read operation fetches correct user data');
    assert(readData.orders[0].totalPrice === 300000, 'Read operation fetches correct order details');

    // 3. Test Stripe Webhook simulation for JSON fallback DB
    const webhookReq = {
      headers: {},
      body: {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_webhook_123',
            amount: 300000,
            metadata: {
              orderId: 'mock-order-1'
            }
          }
        }
      }
    };
    const webhookRes = mockResponse();

    await stripeWebhook(webhookReq, webhookRes);
    const updatedDb = readDb();
    const updatedOrder = updatedDb.orders.find(o => o.id === 'mock-order-1');

    assert(
      updatedOrder && updatedOrder.paymentStatus === 'Paid' && updatedOrder.orderStatus === 'Processing',
      'Stripe Webhook simulation successfully marks offline order as Paid and Processing'
    );

    // 4. Test Offline sync reconciliation runner (skipped if MongoDB URI is not active, but runs successfully without crashing)
    try {
      await syncOfflineData();
      console.log('  ✅ Passed: syncOfflineData executes without throwing errors');
      passed++;
    } catch (err) {
      console.error('  ❌ Failed: syncOfflineData integration crashed:', err.message);
      failed++;
    }

  } catch (error) {
    console.error('❌ Test execution encountered an unhandled error:', error);
    failed++;
  } finally {
    // 5. Restore DB file from backup
    if (dbBackupExists) {
      fs.copyFileSync(BACKUP_FILE, DB_FILE);
      fs.unlinkSync(BACKUP_FILE);
    } else if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
  }

  console.log(`\n🏁 Test Run Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runIntegrationTests();
