import Joi from 'joi';

// Car validation schema
export const carValidationSchema = Joi.object({
  make: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Car make is required',
      'string.max': 'Make cannot exceed 50 characters'
    }),
  
  model: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Car model is required',
      'string.max': 'Model cannot exceed 50 characters'
    }),
  
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be after 1900',
      'number.max': 'Year cannot be in the future'
    }),
  
  price: Joi.number()
    .positive()
    .max(10000000)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be positive',
      'number.max': 'Price cannot exceed 10 million'
    }),
  
  mileage: Joi.number()
    .min(0)
    .max(1000000)
    .required()
    .messages({
      'number.base': 'Mileage must be a number',
      'number.min': 'Mileage must be positive',
      'number.max': 'Mileage cannot exceed 1 million'
    }),
  
  fuelType: Joi.string()
    .valid('petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg')
    .required()
    .messages({
      'any.only': 'Fuel type must be one of: petrol, diesel, electric, hybrid, cng, lpg'
    }),
  
  transmission: Joi.string()
    .valid('manual', 'automatic', 'cvt')
    .required()
    .messages({
      'any.only': 'Transmission must be one of: manual, automatic, cvt'
    }),
  
  bodyType: Joi.string()
    .valid('sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'wagon', 'pickup', 'van')
    .required()
    .messages({
      'any.only': 'Body type must be one of: sedan, hatchback, suv, coupe, convertible, wagon, pickup, van'
    }),
  
  color: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Color is required',
      'string.max': 'Color cannot exceed 30 characters'
    }),
  
  description: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  
  features: Joi.array()
    .items(Joi.string().trim().max(100))
    .max(20)
    .messages({
      'array.max': 'Cannot have more than 20 features',
      'string.max': 'Feature cannot exceed 100 characters'
    }),
  
  images: Joi.array()
    .items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().trim().max(200).allow('')
    }))
    .max(10)
    .messages({
      'array.max': 'Cannot have more than 10 images'
    }),
  
  location: Joi.object({
    city: Joi.string().trim().min(1).max(50).required(),
    state: Joi.string().trim().min(1).max(50).required(),
    country: Joi.string().trim().min(1).max(50).default('India')
  }).required(),
  
  seller: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    phone: Joi.string().trim().pattern(/^[+]?[\d\s\-\(\)]{10,15}$/).required()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    email: Joi.string().email().trim().lowercase().allow('')
  }).required(),
  
  status: Joi.string()
    .valid('available', 'sold', 'reserved')
    .default('available')
});

// User registration validation schema
export const userRegistrationSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email'
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password cannot exceed 128 characters'
    }),
  
  profile: Joi.object({
    firstName: Joi.string().trim().max(50).allow(''),
    lastName: Joi.string().trim().max(50).allow(''),
    phone: Joi.string().trim().pattern(/^[+]?[\d\s\-\(\)]{10,15}$/).allow('')
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      })
  })
});

// User login validation schema
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Query validation schema for car listing
export const carQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('price', '-price', 'year', '-year', 'mileage', '-mileage', 'createdAt', '-createdAt').default('-createdAt'),
  make: Joi.string().trim(),
  model: Joi.string().trim(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  minYear: Joi.number().integer().min(1900),
  maxYear: Joi.number().integer().max(new Date().getFullYear() + 1),
  fuelType: Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'),
  transmission: Joi.string().valid('manual', 'automatic', 'cvt'),
  bodyType: Joi.string().valid('sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'wagon', 'pickup', 'van'),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  status: Joi.string().valid('available', 'sold', 'reserved').default('available')
});

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.body = value;
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors
      });
    }

    // Store validated query in a new property instead of overwriting req.query
    req.validatedQuery = value;
    next();
  };
};
