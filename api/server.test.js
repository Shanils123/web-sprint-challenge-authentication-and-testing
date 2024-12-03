const request = require('supertest');
const server = require('./server.js');
const db = require('../data/dbConfig');
const bcrypt = require('bcryptjs'); 

test('sanity', () => {
  expect(true).toBe(true);
});

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await db('users').truncate(); 
  });

  it('should return 201 Created on successful registration', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
  });

  it('should return 400 if username or password is missing', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username and password required');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await db('users').truncate();
    const hash = bcrypt.hashSync('password123', 12); 
    await db('users').insert({ username: 'testuser', password: hash });
  });

  it('should return 200 OK on successful login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token'); 
  });

  it('should return 401 Unauthorized if credentials are invalid', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(res.status).toBe(401); 
  });
});

describe('GET /api/jokes', () => {
  beforeEach(async () => {
    await db('users').truncate();
    const hash = bcrypt.hashSync('password123', 12);
    await db('users').insert({ username: 'testuser', password: hash });
  });

  it('should return 200 OK with an array of jokes when authenticated', async () => {
    const loginRes = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    const token = loginRes.body.token;

    const res = await request(server)
      .get('/api/jokes')
      .auth(token, { type: 'bearer' });
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array); 
  });

  it('should return 401 Unauthorized when not authenticated', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401); 
  });

  afterAll(async () => {
    await db.destroy();
  });
});
