const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  test('should return 200 and JSON with status ok', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
