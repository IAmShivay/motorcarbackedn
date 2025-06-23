import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true,
    maxlength: [50, 'Make cannot exceed 50 characters'],
    index: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true,
    maxlength: [50, 'Model cannot exceed 50 characters'],
    index: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
    max: [10000000, 'Price cannot exceed 10 million']
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage must be positive'],
    max: [1000000, 'Mileage cannot exceed 1 million']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: {
      values: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'],
      message: 'Fuel type must be one of: petrol, diesel, electric, hybrid, cng, lpg'
    },
    lowercase: true
  },
  transmission: {
    type: String,
    required: [true, 'Transmission is required'],
    enum: {
      values: ['manual', 'automatic', 'cvt'],
      message: 'Transmission must be one of: manual, automatic, cvt'
    },
    lowercase: true
  },
  bodyType: {
    type: String,
    required: [true, 'Body type is required'],
    enum: {
      values: ['sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'wagon', 'pickup', 'van'],
      message: 'Body type must be one of: sedan, hatchback, suv, coupe, convertible, wagon, pickup, van'
    },
    lowercase: true
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
    maxlength: [30, 'Color cannot exceed 30 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature cannot exceed 100 characters']
  }],
  images: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    alt: {
      type: String,
      trim: true,
      maxlength: [200, 'Alt text cannot exceed 200 characters']
    }
  }],
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [50, 'Country cannot exceed 50 characters'],
      default: 'India'
    }
  },
  seller: {
    name: {
      type: String,
      required: [true, 'Seller name is required'],
      trim: true,
      maxlength: [100, 'Seller name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Seller phone is required'],
      trim: true,
      match: [/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    }
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'sold', 'reserved'],
      message: 'Status must be one of: available, sold, reserved'
    },
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ fuelType: 1 });
carSchema.index({ bodyType: 1 });
carSchema.index({ 'location.city': 1 });
carSchema.index({ status: 1, isActive: 1 });
carSchema.index({ createdAt: -1 });

// Virtual for car title
carSchema.virtual('title').get(function() {
  return `${this.year} ${this.make} ${this.model}`;
});

// Virtual for formatted price
carSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(this.price);
});

// Pre-save middleware to ensure data consistency
carSchema.pre('save', function(next) {
  // Capitalize first letter of make and model
  if (this.make) {
    this.make = this.make.charAt(0).toUpperCase() + this.make.slice(1).toLowerCase();
  }
  if (this.model) {
    this.model = this.model.charAt(0).toUpperCase() + this.model.slice(1).toLowerCase();
  }
  next();
});

const Car = mongoose.model('Car', carSchema);

export default Car;
