import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleVisualSearch } from '../controllers/aiController.js';
import * as jsonDb from '../utils/jsonDb.js';

vi.mock('../utils/jsonDb.js', () => ({
  readDb: vi.fn()
}));

describe('aiController - handleVisualSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'your_gemini_api_key_here'; // force heuristic path
  });

  it('should fall back to filename heuristics for visual search if no upload file/base64 is processed', async () => {
    const mockDb = {
      products: [
        { id: '1', title: 'Premium Gold Watch', category: 'accessories', price: 25000 },
        { id: '2', title: 'Luxury Leather Boot', category: 'shoes', price: 15000 }
      ]
    };
    jsonDb.readDb.mockReturnValue(mockDb);

    const req = {
      body: {
        fileName: 'my_brand_new_watch_collection.png'
      }
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await handleVisualSearch(req, res);

    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.message).toContain('Identified visual category: "watch"');
    expect(responseData.recommendedProducts).toHaveLength(1);
    expect(responseData.recommendedProducts[0].title).toBe('Premium Gold Watch');
  });

  it('should support category input parameter directly', async () => {
    const mockDb = {
      products: [
        { id: '1', title: 'Designer Black Shirt', category: 'clothing', price: 5000 }
      ]
    };
    jsonDb.readDb.mockReturnValue(mockDb);

    const req = {
      body: {
        category: 'clothing'
      }
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await handleVisualSearch(req, res);

    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.message).toContain('Identified visual category: "clothing"');
    expect(responseData.recommendedProducts[0].title).toBe('Designer Black Shirt');
  });
});
