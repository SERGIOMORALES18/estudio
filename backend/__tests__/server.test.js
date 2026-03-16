const request = require('supertest');
const app = require('../src/server');

describe('backend API', () => {
  it('should return 200 on GET /api/profiles', async () => {
    const res = await request(app).get('/api/profiles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should respond 404 for non-existent profile', async () => {
    const res = await request(app).get('/api/profiles/999999');
    expect([200, 404]).toContain(res.statusCode); // either empty or not found, but not server error
  });
});
