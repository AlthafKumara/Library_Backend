import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


import { NODE_ENV, MAX_FILE_SIZE_MB } from './config/env.js';
import  {errorHandler, undefinedRoute } from './middlewares/errorHandler.js';
import authRoute from './routes/auth_routes.js';
import profileRoute from "./routes/profile_routes.js"
import bookRoute from './routes/book_routes.js';

import borrowRoute from './routes/borrow_routes.js';
import categoryRoute from './routes/category_routes.js';
import { baseApi } from './middlewares/base_handle.js';

const app = express();

app.use(helmet());
app.use(cookieParser());
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
app.get(API, baseApi(NODE_ENV))

app.use(`${API}/auth`, authRoute);
app.use(`${API}/profile`, profileRoute);
app.use(`${API}/books`, bookRoute);
app.use(`${API}/borrows`, borrowRoute);
app.use(`${API}/categories`, categoryRoute);

// 404 handler
app.use(undefinedRoute);

// Global error handler
app.use(errorHandler);

export default app;