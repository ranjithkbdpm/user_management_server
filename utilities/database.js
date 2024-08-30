// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const server = process.env.DB_SERVER || '127.0.0.1:27017'; 
const database = process.env.DB_NAME || 'user-manager'; 

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
      })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error: ' + err.message);
      });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error: ' + err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });


    // handle the termination signal (SIGINT) sent to the process, typically when the user interrupts the process by pressing Ctrl+C in the terminal. This block ensures that the application can perform clean-up tasks before shutting down.
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose disconnected on app termination');
      process.exit(0);
    });
  }
}

export default new Database();
