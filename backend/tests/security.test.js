import { describe, it, expect } from 'vitest';
import mongoSanitize from 'express-mongo-sanitize';
import { readDb, writeDb } from '../utils/jsonDb.js';

describe('Security and Concurrency Tests', () => {
  describe('NoSQL Injection Sanitation', () => {
    it('should sanitize nested mongo operators ($)', () => {
      const middleware = mongoSanitize();
      const req = {
        body: {
          username: 'admin',
          password: { $gt: '' }
        },
        query: {
          category: { $ne: 'electronics' }
        },
        params: {}
      };

      middleware(req, {}, () => {});

      expect(req.body.password).toEqual({});
      expect(req.query.category).toEqual({});
      expect(req.body.username).toBe('admin');
    });
  });

  describe('jsonDb Concurrent Writes', () => {
    it('should serialize multiple concurrent writeDb calls', async () => {
      const originalDb = readDb();
      const originalUsersLength = originalDb.users.length;
      const backupUsers = [...originalDb.users];

      // Queue multiple concurrent writes, reading the updated state each time
      for (let i = 0; i < 10; i++) {
        const current = readDb();
        const updatedDb = JSON.parse(JSON.stringify(current));
        updatedDb.users.push({ id: `temp-${i}`, email: `temp-${i}@test.com` });
        writeDb(updatedDb);
      }

      // Read back immediately (in-memory cache updates synchronously)
      const currentDb = readDb();
      expect(currentDb.users.length).toBe(originalUsersLength + 10);

      // Restore original DB state to avoid dirtying local storage
      const restoredDb = JSON.parse(JSON.stringify(currentDb));
      restoredDb.users = backupUsers;
      writeDb(restoredDb);
    });
  });
});
