import Car from '../models/Car.js';

/**
 * @desc    Get all cars with filtering, sorting, and pagination
 * @route   GET /api/cars
 * @access  Public
 */
export const getCars = async (req, res, next) => {
  try {
    // Use validatedQuery if available (from validation middleware), otherwise use req.query
    const queryParams = req.validatedQuery || req.query;

    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      make,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuelType,
      transmission,
      bodyType,
      city,
      state,
      status = 'available'
    } = queryParams;

    // Build filter object
    const filter = { isActive: true, status };

    if (make) filter.make = new RegExp(make, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = Number(minYear);
      if (maxYear) filter.year.$lte = Number(maxYear);
    }
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (bodyType) filter.bodyType = bodyType;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const cars = await Car.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Car.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      count: cars.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      },
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single car by ID
 * @route   GET /api/cars/:id
 * @access  Public
 */
export const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).select('-__v');

    if (!car || !car.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Increment view count
    await Car.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new car listing
 * @route   POST /api/cars
 * @access  Private (requires authentication)
 */
export const createCar = async (req, res, next) => {
  try {
    // Ensure seller information is set from authenticated user
    const carData = {
      ...req.body,
      seller: {
        ...req.body.seller,
        email: req.user.email // Set seller email from authenticated user
      }
    };

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car listing created successfully',
      data: car
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update car listing
 * @route   PUT /api/cars/:id
 * @access  Private (requires authentication)
 */
export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully',
      data: updatedCar
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete car listing (soft delete)
 * @route   DELETE /api/cars/:id
 * @access  Private (requires authentication)
 */
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Soft delete by setting isActive to false
    await Car.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's car listings
 * @route   GET /api/cars/my-listings
 * @access  Private (requires authentication)
 */
export const getMyCars = async (req, res, next) => {
  try {
    // Get cars created by the current user
    // Handle both cases: cars with email set and cars without email (legacy)
    const query = {
      isActive: true,
      $or: [
        { 'seller.email': req.user.email },
        {
          'seller.email': { $in: ['', null] },
          'seller.name': req.user.username
        }
      ]
    };

    const cars = await Car.find(query)
      .sort('-createdAt')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get car statistics
 * @route   GET /api/cars/stats
 * @access  Public
 */
export const getCarStats = async (req, res, next) => {
  try {
    const stats = await Car.aggregate([
      {
        $match: { isActive: true, status: 'available' }
      },
      {
        $group: {
          _id: null,
          totalCars: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgYear: { $avg: '$year' },
          avgMileage: { $avg: '$mileage' }
        }
      }
    ]);

    const makeStats = await Car.aggregate([
      {
        $match: { isActive: true, status: 'available' }
      },
      {
        $group: {
          _id: '$make',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const fuelTypeStats = await Car.aggregate([
      {
        $match: { isActive: true, status: 'available' }
      },
      {
        $group: {
          _id: '$fuelType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        topMakes: makeStats,
        fuelTypeDistribution: fuelTypeStats
      }
    });
  } catch (error) {
    next(error);
  }
};
