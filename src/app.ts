import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes'; 

const app: Application = express();

// --- Parsers ---
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// --- Application Routes ---

app.use('/api/v1', router);

// --- Basic Test Route ---
app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Welcome to MediStore Server! 🚀',
    status: 'Running',
  });
});


app.use((err: any, req: Request, res: Response, next: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  return res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
});

/**
 * Handle Not Found Routes (ভুল কোনো ইউআরএল এ হিট করলে এটি কাজ করবে)
 */
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'API Endpoint Not Found!',
    error: {
      path: req.originalUrl,
      message: 'The requested URL was not found on this server.',
    },
  });
});

export default app;