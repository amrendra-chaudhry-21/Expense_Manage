import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';

import { errorHandler } from './middleware/errorMiddleware.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Security Middlewares
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000, 
});
app.use(limiter);

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Sanitize data
app.use(mongoSanitize());

// CORS configuration - support frontend at port 5173 and 5174
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', process.env.FRONTEND_URL],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Static files
app.use(express.static('public'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error Middleware
app.use(errorHandler);

export { app };
