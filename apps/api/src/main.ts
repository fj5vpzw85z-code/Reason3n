import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/v1/auth', authRoutes);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`[API] Reason3n Backend is running on port ${port}`);
});
