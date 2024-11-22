import express from 'express';
import { configStore } from '../configs/configStore.js';

export default function createRoutes({ langChainRepository }) {
    if (!langChainRepository) {
        console.error('langChainRepository is undefined in createRoutes');
        throw new Error('LangChainRepository is not properly initialized');
    }
    const router = express.Router();

    router.post('/fetch-subtitles', async (req, res) => {
        try {
            const {
                query: url,
                openAiKey,
                pineconeKey,
                pineconeIndex,
                tavilyApiKey,
            } = req.body;

            if (
                !url ||
                !openAiKey ||
                !pineconeKey ||
                !pineconeIndex ||
                !tavilyApiKey
            ) {
                return res
                    .status(400)
                    .json({ error: 'Missing required fields' });
            }

            configStore.updateConfig({
                openAiKey,
                pineconeKey,
                pineconeIndex,
                tavilyApiKey,
            });

            langChainRepository.updateClients();

            if (!langChainRepository.isConfigured()) {
                return res
                    .status(500)
                    .json({ error: 'Failed to configure clients' });
            }

            const result = await langChainRepository.implementFetchSubtitles(
                url
            );
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/rag-query', async (req, res) => {
        try {
            if (!configStore.isConfigured()) {
                return res.status(400).json({
                    error: 'Configuration not set. Please call /fetch-subtitles first.',
                });
            }

            const query = req.body.query;
            console.log('query>>>>>>', query);

            if (!query) {
                return res.status(400).json({ error: 'Query is required' });
            }

            const question = query;
            const chatHistory = [];
            const topK = 3;

            const result = await langChainRepository.chatWithRag(
                question,
                chatHistory,
                topK
            );

            res.json(result);
        } catch (error) {
            console.error('Error in RAG query:', error);
            res.status(500).json({
                error: 'An error occurred while processing your request',
            });
        }
    });
    return router;
}
