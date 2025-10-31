import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../models/Student.js';

// Load environment variables
dotenv.config();

const dropOldIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the Student collection
    const collection = mongoose.connection.collection('students');

    // List all indexes
    console.log('\nCurrent indexes on students collection:');
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Drop the email_1 index if it exists
    try {
      await collection.dropIndex('email_1');
      console.log('\n✅ Successfully dropped email_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️  email_1 index does not exist (already dropped)');
      } else {
        throw error;
      }
    }

    // List indexes after dropping
    console.log('\nIndexes after cleanup:');
    const updatedIndexes = await collection.indexes();
    console.log(JSON.stringify(updatedIndexes, null, 2));

    console.log('\n✅ Index cleanup completed successfully');
  } catch (error) {
    console.error('❌ Error dropping index:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

dropOldIndexes();
