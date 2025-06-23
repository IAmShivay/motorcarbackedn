import mongoose from 'mongoose';
import Car from '../models/Car.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateCars = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all cars with empty or missing seller email
    const carsToUpdate = await Car.find({
      $or: [
        { 'seller.email': '' },
        { 'seller.email': { $exists: false } },
        { 'seller.email': null }
      ]
    });

    console.log(`Found ${carsToUpdate.length} cars to update`);

    // For each car, try to find a matching user and update the seller email
    for (const car of carsToUpdate) {
      try {
        // Try to find user by seller name (username)
        const user = await User.findOne({ 
          $or: [
            { username: car.seller.name },
            { 'profile.firstName': car.seller.name },
            { email: car.seller.name }
          ]
        });

        if (user) {
          // Update the car with the user's email
          await Car.findByIdAndUpdate(car._id, {
            'seller.email': user.email
          });
          console.log(`Updated car ${car._id} with email ${user.email}`);
        } else {
          console.log(`No user found for car ${car._id} with seller name: ${car.seller.name}`);
          
          // If no user found, create a default email based on seller name
          const defaultEmail = `${car.seller.name.toLowerCase().replace(/\s+/g, '')}@example.com`;
          await Car.findByIdAndUpdate(car._id, {
            'seller.email': defaultEmail
          });
          console.log(`Updated car ${car._id} with default email ${defaultEmail}`);
        }
      } catch (error) {
        console.error(`Error updating car ${car._id}:`, error.message);
      }
    }

    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCars();
}

export default migrateCars;
