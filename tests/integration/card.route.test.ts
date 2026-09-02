import request from 'supertest';
import app from '../../src/app';

describe('Card Validation API Integration Tests', () => {
  describe('POST /api/cards/validate', () => {
    it('should validate a valid Visa card number and return 200 OK', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({ cardNumber: '4532015112830366' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(true);
      expect(response.body.data.cardBrand).toBe('Visa');
      expect(response.body.data.cardNumber).toBe('4532015112830366');
    });

    it('should handle card numbers formatted with spaces or hyphens', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({ cardNumber: '3782-822463-10005' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(true);
      expect(response.body.data.cardBrand).toBe('American Express');
      expect(response.body.data.cardNumber).toBe('378282246310005');
    });

    it('should return 200 OK with isValid: false for invalid checksum card number', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({ cardNumber: '4532015112830367' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(false);
      expect(response.body.data.cardBrand).toBe('Visa');
    });

    it('should support alternative field name card_number', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({ card_number: '4532015112830366' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isValid).toBe(true);
    });

    it('should return 400 Bad Request when cardNumber is missing', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_CARD_NUMBER');
    });

    it('should return 400 Bad Request when cardNumber is not a string', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({ cardNumber: 1234567890123456 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_TYPE');
    });

    it('should return 400 Bad Request when cardNumber is empty', async () => {
      const response = await request(app)
        .post('/api/cards/validate')
        .send({ cardNumber: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EMPTY_CARD_NUMBER');
    });
  });

  describe('GET /', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('404 Handling', () => {
    it('should return 404 Not Found for non-existent endpoint', async () => {
      const response = await request(app).get('/api/v1/unknown');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
