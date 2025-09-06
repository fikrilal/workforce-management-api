import request from 'supertest';
import { createServer } from '../../infrastructure/http/server';

describe('Health', () => {
  it('returns ok', async () => {
    const app = createServer();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.data.health).toBe('ok');
  });
});

