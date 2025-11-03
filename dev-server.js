import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { generateSoulPrint } from './api/dist/generateSoulPrint.js';
import { continueChat } from './api/dist/continueChat.js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies and enable CORS
app.use(cors());
app.use(express.json());

// API routes
app.post('/api/generateSoulPrint', async (req, res) => {
  try {
    // Convert Express request to match the expected format
    const mockReq = {
      method: 'POST',
      body: req.body,
      headers: req.headers
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => res.status(code).json(data)
      }),
      json: (data) => res.json(data)
    };
    
    await generateSoulPrint(mockReq, mockRes);
  } catch (error) {
    console.error('Error in generateSoulPrint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/continueChat', async (req, res) => {
  try {
    // Convert Express request to match the expected format
    const mockReq = {
      method: 'POST',
      body: req.body,
      headers: req.headers
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => res.status(code).json(data)
      }),
      json: (data) => res.json(data)
    };
    
    await continueChat(mockReq, mockRes);
  } catch (error) {
    console.error('Error in continueChat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Development API server running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  POST http://localhost:${PORT}/api/generateSoulPrint`);
  console.log(`  POST http://localhost:${PORT}/api/continueChat`);
});