import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './Routes/index.js';
import { syncDatabase } from './Model/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🌾 AgroFarm API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 5MB' });
    }
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: err.message || 'Server error' });
});

// Start server
const startServer = async () => {
  await syncDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();