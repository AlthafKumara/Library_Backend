import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { NODE_ENV, MAX_FILE_SIZE_MB } from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoute from './routes/auth_routes.js';
import bookRoute from './routes/book_routes.js';
import borrowRoute from './routes/borrow_routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan(
  NODE_ENV === 'production' ? 'combined' : 'dev'
));
app.use(express.json({ limit: `${MAX_FILE_SIZE_MB}mb` }));
app.use(express.urlencoded({ extended: true }));

const API = '/api/v1';
// BASE RETURN API
app.get(API, (req, res) => {
  res.json({
    Status: "Success",
    env: NODE_ENV,
    Message : "Selamat datang di Library API Althaf"
  });
});

app.use(`${API}/auth`, authRoute);
app.use(`${API}/books`, bookRoute);
app.use(`${API}/borrows`, borrowRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route tidak ditemukan',
    path: req.originalUrl,
  });
});

// Global error handler
app.use(errorHandler);

export default app;