import express from 'express';
import cors from 'cors'; // Import the cors package
import { LangChainRepository } from './repositories/langchainRepository.js';
import createRoutes from './routes/routes.js';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

const langChainRepository = new LangChainRepository();

app.use('/api', createRoutes({ langChainRepository }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
