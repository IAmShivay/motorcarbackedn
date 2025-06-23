// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the ms_motor database
db = db.getSiblingDB('ms_motor');

// Create collections with indexes for better performance
db.createCollection('users');
db.createCollection('cars');

// Create indexes for users collection
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

// Create indexes for cars collection
db.cars.createIndex({ "make": 1 });
db.cars.createIndex({ "model": 1 });
db.cars.createIndex({ "year": 1 });
db.cars.createIndex({ "price": 1 });
db.cars.createIndex({ "location.city": 1 });
db.cars.createIndex({ "location.state": 1 });
db.cars.createIndex({ "fuelType": 1 });
db.cars.createIndex({ "transmission": 1 });
db.cars.createIndex({ "bodyType": 1 });
db.cars.createIndex({ "status": 1 });
db.cars.createIndex({ "createdAt": 1 });
db.cars.createIndex({ "seller.email": 1 });

// Create compound indexes for common queries
db.cars.createIndex({ "make": 1, "model": 1 });
db.cars.createIndex({ "location.city": 1, "location.state": 1 });
db.cars.createIndex({ "price": 1, "year": 1 });
db.cars.createIndex({ "status": 1, "createdAt": -1 });

// Insert sample data (optional)
db.cars.insertMany([
  {
    make: "Maruti Suzuki",
    model: "Swift",
    year: 2020,
    price: 550000,
    mileage: 25000,
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "Hatchback",
    color: "Red",
    description: "Well maintained Maruti Swift in excellent condition",
    images: ["https://example.com/swift1.jpg"],
    location: {
      city: "Mumbai",
      state: "Maharashtra"
    },
    seller: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210"
    },
    status: "available",
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    make: "Hyundai",
    model: "i20",
    year: 2019,
    price: 650000,
    mileage: 30000,
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "Hatchback",
    color: "White",
    description: "Hyundai i20 with automatic transmission, perfect for city driving",
    images: ["https://example.com/i20.jpg"],
    location: {
      city: "Delhi",
      state: "Delhi"
    },
    seller: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 9876543211"
    },
    status: "available",
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully with indexes and sample data');
