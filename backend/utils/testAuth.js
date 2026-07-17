import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';
import jwt from 'jsonwebtoken';

// Helper to construct mock Express request, response, and next function
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
  return res;
};

const runTests = () => {
  console.log('🧪 Starting Authentication & Validation Tests...');

  let testPassedCount = 0;
  let testFailedCount = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ Passed: ${message}`);
      testPassedCount++;
    } else {
      console.error(`  ❌ Failed: ${message}`);
      testFailedCount++;
    }
  };

  // Test 1: validateRegister rejects missing fields
  try {
    const req = { body: { name: '', email: '', password: '' } };
    const res = mockResponse();
    let nextCalled = false;
    validateRegister(req, res, () => { nextCalled = true; });
    assert(res.statusCode === 400 && res.body.message === 'Name is required', 'Register fails on empty name');
  } catch (err) {
    console.error(err);
    testFailedCount++;
  }

  // Test 2: validateRegister rejects invalid email
  try {
    const req = { body: { name: 'Thapa User', email: 'invalid-email', password: 'Password123!' } };
    const res = mockResponse();
    let nextCalled = false;
    validateRegister(req, res, () => { nextCalled = true; });
    assert(res.statusCode === 400 && res.body.message === 'A valid email address is required', 'Register fails on invalid email format');
  } catch (err) {
    console.error(err);
    testFailedCount++;
  }

  // Test 3: validateRegister rejects weak passwords
  try {
    const req = { body: { name: 'Thapa User', email: 'user@thapamart.com', password: '123', phone: '+1234567890' } };
    const res = mockResponse();
    let nextCalled = false;
    validateRegister(req, res, () => { nextCalled = true; });
    assert(res.statusCode === 400 && res.body.message.includes('Password must be at least 8 characters long'), 'Register fails on weak password');
  } catch (err) {
    console.error(err);
    testFailedCount++;
  }

  // Test 4: validateRegister accepts valid registration details
  try {
    const req = { body: { name: 'Thapa User', email: 'user@thapamart.com', password: 'StrongPassword1!', phone: '+1234567890' } };
    const res = mockResponse();
    let nextCalled = false;
    validateRegister(req, res, () => { nextCalled = true; });
    assert(nextCalled === true, 'Register validation succeeds with valid fields');
  } catch (err) {
    console.error(err);
    testFailedCount++;
  }

  // Test 5: validateLogin rejects invalid email
  try {
    const req = { body: { email: 'bademail', password: 'Password123!' } };
    const res = mockResponse();
    let nextCalled = false;
    validateLogin(req, res, () => { nextCalled = true; });
    assert(res.statusCode === 400 && res.body.message === 'A valid email address is required', 'Login validation rejects bad email format');
  } catch (err) {
    console.error(err);
    testFailedCount++;
  }

  // Test 6: Verify Token Generation and Decoding
  try {
    const secret = 'thapamart_test_secret';
    const payload = { id: 'user-12345' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    assert(decoded.id === 'user-12345', 'JWT generates and decodes successfully');
  } catch (err) {
    console.error(err);
    testFailedCount++;
  }

  console.log(`\n🏁 Test Run Summary: ${testPassedCount} passed, ${testFailedCount} failed.`);
  if (testFailedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
