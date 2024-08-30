import dotenv from 'dotenv';

dotenv.config();
// database
export const server = process.env.MONGODB_URI || '127.0.0.1:27017'; 
export const database = process.env.DB_NAME || 'user-management'; 

// port
export const port =process.env.PORT || 3500;
