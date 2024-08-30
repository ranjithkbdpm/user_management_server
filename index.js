import express from 'express';
import http from 'http';
import api from './api/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { port } from './config.js';


const app = express();

app.use(cors())

app.use(cookieParser());
app.use(express.json())


app.use("/api", api);

// create server
const server = http.createServer(app);

const startServer = async () => {
    try {
      // Await the database connection
      await import('./utilities/database.js');
  
      // Add listeners for unhandled exceptions and rejections
      process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err.message);
        process.exit(1);
      });
  
      process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection:', reason);
        process.exit(1);
      });
  
      // Start the server after the database connection is established
      server.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
      });
  
      // Set server timeout
      server.setTimeout(10 * 60 * 1000); // 10 minutes
    } catch (err) {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    }
  };

startServer();

export default app;




