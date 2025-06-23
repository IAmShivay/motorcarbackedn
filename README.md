# Car Listing Backend API

A secure and scalable car listing API built with Node.js, Express, and MongoDB.

## Features

- 🚗 Complete car listing CRUD operations
- 🔐 JWT-based authentication and authorization
- 📊 Advanced filtering, sorting, and pagination
- 🛡️ Comprehensive security middleware
- 📝 Input validation and sanitization
- 📈 Rate limiting and request throttling
- 📚 Swagger API documentation
- 🧪 Comprehensive test coverage
- 🏗️ Clean architecture with separation of concerns

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── tests/               # Test files
├── .env.example         # Environment variables template
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas (cloud)

5. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/car-listing |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Cars
- `GET /api/cars` - List cars with filtering/pagination
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car listing (protected)
- `PUT /api/cars/:id` - Update car listing (protected)
- `DELETE /api/cars/:id` - Delete car listing (protected)
- `GET /api/cars/stats` - Get car statistics

### System
- `GET /health` - Health check
- `GET /api-docs` - API documentation

## Query Parameters (GET /api/cars)

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `sort` | string | Sort field (price, year, mileage, createdAt) |
| `make` | string | Filter by car make |
| `model` | string | Filter by car model |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `minYear` | number | Minimum year filter |
| `maxYear` | number | Maximum year filter |
| `fuelType` | string | Filter by fuel type |
| `transmission` | string | Filter by transmission |
| `bodyType` | string | Filter by body type |
| `city` | string | Filter by city |
| `state` | string | Filter by state |

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Joi schema validation for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and verification
- **MongoDB Injection Protection**: Mongoose built-in protection

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Documentation

When the server is running, visit:
- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient aggregation pipelines for statistics
- Connection pooling with Mongoose
- Rate limiting to prevent abuse

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.
# motorcarbackedn
