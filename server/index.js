import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors'; // Import the cors package
import { LangchainCLient } from './clients/langchainClient.js';
import { OpenAiRepository } from './repositories/openAiRepository.js';
import createRoutes from './routes/routes.js';
import { PineConeClient } from './clients/pineconeClient.js';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
const langchainClient = new LangchainCLient(process.env.OPENAI_KEY);
const pineconeClient = new PineConeClient(process.env.PINECONE_KEY);

const openAiRepository = new OpenAiRepository(langchainClient, pineconeClient);

app.use('/api', createRoutes({ openAiRepository }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
