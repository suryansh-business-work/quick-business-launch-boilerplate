// Core & Third-party Imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dayjs from 'dayjs';
import 'reflect-metadata';

// Database
import { connectDB } from './db';

const port = 4005;

// Express App Initialization
const app = express();

// ==========
// Middleware
// ==========
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '*';
app.use((req, res, next) => {
  // Allow origin (configurable)
  res.setHeader('Access-Control-Allow-Origin', CORS_ALLOW_ORIGIN);

  // Allow all common HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');

  // If the browser sends a preflight request specifying desired headers, echo them back
  // This effectively allows arbitrary request headers the client asks for.
  const requestedHeaders = req.headers['access-control-request-headers'];
  if (requestedHeaders) {
    res.setHeader('Access-Control-Allow-Headers', requestedHeaders);
  } else {
    // Fallback safe set
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  }

  // Only set credentials when a specific origin is configured (not '*')
  if (CORS_ALLOW_ORIGIN !== '*') res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Cache preflight for 24 hours
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ===============
// Utility Routes
// ===============
app.get('/healthcheck', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.status(200).send(`🚀 Server is running at http://localhost:${port}`);
});

app.get('/data-and-time', (_req, res) => {
  const formattedTime = dayjs().format('DD MMM YYYY hh:mm A');
  res.status(200).send(`Current time: ${formattedTime}`);
});

// ===================
// Start Server
// ===================
const startServer = async () => {
  await connectDB(); // Connect to MongoDB first

  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
    // startWebSocketServer(); // Start WebSocket server only after DB is connected
  });
};

startServer();

export default app;
