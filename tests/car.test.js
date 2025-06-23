import request from 'supertest';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Car from '../src/models/Car.js';
import { generateTokens } from '../src/utils/jwt.js';

describe('Car API', () => {
  let authToken;
  let testUser;
  let testCar;

  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      profile: {
        firstName: 'Test',
        lastName: 'User',
        phone: '+91 98765 43210'
      }
    });

    // Generate auth token
    const tokens = generateTokens(testUser);
    authToken = tokens.accessToken;
  });

  afterAll(async () => {
    // Clean up test data
    await Car.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /api/cars', () => {
    beforeEach(async () => {
      // Create test cars
      await Car.create([
        {
          make: 'Maruti Suzuki',
          model: 'Swift',
          year: 2020,
          price: 600000,
          mileage: 25000,
          fuelType: 'petrol',
          transmission: 'manual',
          bodyType: 'hatchback',
          color: 'White',
          location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
          seller: { name: 'Test Seller', phone: '+91 98765 43210' }
        },
        {
          make: 'Hyundai',
          model: 'i20',
          year: 2019,
          price: 550000,
          mileage: 30000,
          fuelType: 'diesel',
          transmission: 'automatic',
          bodyType: 'hatchback',
          color: 'Blue',
          location: { city: 'Delhi', state: 'Delhi', country: 'India' },
          seller: { name: 'Another Seller', phone: '+91 87654 32109' }
        }
      ]);
    });

    afterEach(async () => {
      await Car.deleteMany({});
    });

    it('should get all cars', async () => {
      const response = await request(app)
        .get('/api/cars')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter cars by make', async () => {
      const response = await request(app)
        .get('/api/cars?make=Maruti Suzuki')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].make).toBe('Maruti Suzuki');
    });

    it('should filter cars by price range', async () => {
      const response = await request(app)
        .get('/api/cars?minPrice=500000&maxPrice=580000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].price).toBe(550000);
    });

    it('should sort cars by price', async () => {
      const response = await request(app)
        .get('/api/cars?sort=price')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].price).toBeLessThan(response.body.data[1].price);
    });
  });

  describe('POST /api/cars', () => {
    const validCarData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      price: 1200000,
      mileage: 15000,
      fuelType: 'petrol',
      transmission: 'automatic',
      bodyType: 'sedan',
      color: 'Silver',
      description: 'Excellent condition',
      features: ['Air Conditioning', 'Power Steering'],
      images: [{ url: 'https://example.com/car.jpg', alt: 'Car image' }],
      location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      seller: { name: 'Car Seller', phone: '+91 99999 88888' }
    };

    it('should create a car with valid data and auth token', async () => {
      const response = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCarData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.make).toBe('Toyota');
      expect(response.body.data.model).toBe('Camry');
    });

    it('should reject car creation without auth token', async () => {
      const response = await request(app)
        .post('/api/cars')
        .send(validCarData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No token provided');
    });

    it('should reject car creation with invalid data', async () => {
      const invalidData = { ...validCarData };
      delete invalidData.make; // Remove required field

      const response = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });

    it('should reject car with invalid price', async () => {
      const invalidData = { ...validCarData, price: -1000 };

      const response = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/cars/:id', () => {
    beforeEach(async () => {
      testCar = await Car.create({
        make: 'Honda',
        model: 'City',
        year: 2020,
        price: 800000,
        mileage: 20000,
        fuelType: 'petrol',
        transmission: 'manual',
        bodyType: 'sedan',
        color: 'Red',
        location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
        seller: { name: 'Honda Seller', phone: '+91 77777 66666' }
      });
    });

    afterEach(async () => {
      await Car.deleteMany({});
    });

    it('should get a car by ID', async () => {
      const response = await request(app)
        .get(`/api/cars/${testCar._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testCar._id.toString());
      expect(response.body.data.make).toBe('Honda');
    });

    it('should return 404 for non-existent car', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/cars/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should increment view count', async () => {
      const initialViewCount = testCar.viewCount;

      await request(app)
        .get(`/api/cars/${testCar._id}`)
        .expect(200);

      const updatedCar = await Car.findById(testCar._id);
      expect(updatedCar.viewCount).toBe(initialViewCount + 1);
    });
  });

  describe('PUT /api/cars/:id', () => {
    beforeEach(async () => {
      testCar = await Car.create({
        make: 'Nissan',
        model: 'Micra',
        year: 2018,
        price: 400000,
        mileage: 35000,
        fuelType: 'petrol',
        transmission: 'manual',
        bodyType: 'hatchback',
        color: 'Black',
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        seller: { name: 'Nissan Seller', phone: '+91 55555 44444' }
      });
    });

    afterEach(async () => {
      await Car.deleteMany({});
    });

    it('should update a car with valid data and auth token', async () => {
      const updateData = { price: 450000, description: 'Updated description' };

      const response = await request(app)
        .put(`/api/cars/${testCar._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(450000);
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should reject update without auth token', async () => {
      const updateData = { price: 450000 };

      const response = await request(app)
        .put(`/api/cars/${testCar._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    beforeEach(async () => {
      testCar = await Car.create({
        make: 'Ford',
        model: 'EcoSport',
        year: 2017,
        price: 500000,
        mileage: 40000,
        fuelType: 'diesel',
        transmission: 'manual',
        bodyType: 'suv',
        color: 'White',
        location: { city: 'Kolkata', state: 'West Bengal', country: 'India' },
        seller: { name: 'Ford Seller', phone: '+91 33333 22222' }
      });
    });

    afterEach(async () => {
      await Car.deleteMany({});
    });

    it('should soft delete a car with auth token', async () => {
      const response = await request(app)
        .delete(`/api/cars/${testCar._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify car is soft deleted (isActive = false)
      const deletedCar = await Car.findById(testCar._id);
      expect(deletedCar.isActive).toBe(false);
    });

    it('should reject delete without auth token', async () => {
      const response = await request(app)
        .delete(`/api/cars/${testCar._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/cars/stats', () => {
    beforeEach(async () => {
      await Car.create([
        {
          make: 'Maruti Suzuki',
          model: 'Swift',
          year: 2020,
          price: 600000,
          mileage: 25000,
          fuelType: 'petrol',
          transmission: 'manual',
          bodyType: 'hatchback',
          color: 'White',
          location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
          seller: { name: 'Seller 1', phone: '+91 98765 43210' }
        },
        {
          make: 'Maruti Suzuki',
          model: 'Baleno',
          year: 2019,
          price: 700000,
          mileage: 30000,
          fuelType: 'petrol',
          transmission: 'automatic',
          bodyType: 'hatchback',
          color: 'Blue',
          location: { city: 'Delhi', state: 'Delhi', country: 'India' },
          seller: { name: 'Seller 2', phone: '+91 87654 32109' }
        }
      ]);
    });

    afterEach(async () => {
      await Car.deleteMany({});
    });

    it('should get car statistics', async () => {
      const response = await request(app)
        .get('/api/cars/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.overview).toBeDefined();
      expect(response.body.data.topMakes).toBeDefined();
      expect(response.body.data.fuelTypeDistribution).toBeDefined();
      expect(response.body.data.overview.totalCars).toBe(2);
    });
  });
});
