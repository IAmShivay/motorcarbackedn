import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getCarStats,
  getMyCars
} from '../controllers/carController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest, validateQuery, carValidationSchema, carQuerySchema } from '../utils/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - make
 *         - model
 *         - year
 *         - price
 *         - mileage
 *         - fuelType
 *         - transmission
 *         - bodyType
 *         - color
 *         - location
 *         - seller
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the car
 *         make:
 *           type: string
 *           description: Car manufacturer
 *         model:
 *           type: string
 *           description: Car model
 *         year:
 *           type: number
 *           description: Manufacturing year
 *         price:
 *           type: number
 *           description: Car price
 *         mileage:
 *           type: number
 *           description: Car mileage
 *         fuelType:
 *           type: string
 *           enum: [petrol, diesel, electric, hybrid, cng, lpg]
 *         transmission:
 *           type: string
 *           enum: [manual, automatic, cvt]
 *         bodyType:
 *           type: string
 *           enum: [sedan, hatchback, suv, coupe, convertible, wagon, pickup, van]
 *         color:
 *           type: string
 *           description: Car color
 *         description:
 *           type: string
 *           description: Car description
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               alt:
 *                 type: string
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *         seller:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *         status:
 *           type: string
 *           enum: [available, sold, reserved]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/cars/stats:
 *   get:
 *     summary: Get car statistics
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Car statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get('/stats', getCarStats);

/**
 * @swagger
 * /api/cars/my-listings:
 *   get:
 *     summary: Get current user's car listings
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's car listings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-listings', authenticate, getMyCars);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars with filtering and pagination
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of cars per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, year, -year, mileage, -mileage, createdAt, -createdAt]
 *           default: -createdAt
 *         description: Sort order
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Filter by car make
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filter by car model
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *           enum: [petrol, diesel, electric, hybrid, cng, lpg]
 *         description: Filter by fuel type
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */
router.get('/', validateQuery(carQuerySchema), getCars);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car listing
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, validateRequest(carValidationSchema), createCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car retrieved successfully
 *       404:
 *         description: Car not found
 */
router.get('/:id', getCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update a car listing
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, validateRequest(carValidationSchema), updateCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car listing
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, deleteCar);

export default router;
