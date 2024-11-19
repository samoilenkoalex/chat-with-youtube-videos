import express from 'express';

export default function createRoutes({ openAiRepository }) {
    const router = express.Router();

    router.post('/chat', async (req, res) => {
        try {
            const chat = await openAiRepository.implementChat();
            res.json({ message: chat });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                error: 'An error occurred while processing your request',
            });
        }
    });

    router.post('/fetch-subtitles', async (req, res) => {
        //todo:implement request through params

        try {
            const { url } = req.body;
            const result = await openAiRepository.implementFetchSubtitles(
                'https://www.youtube.com/watch?v=hUyj3d-BSh8'
            );
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/similarity-search', async (req, res) => {
        try {
            const { url } = req.body;
            const result = await openAiRepository.implementSimilaritySearch(
                'video about cardio'
            );
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/rag-query', async (req, res) => {
        try {
            //todo:implement request through params
            // const { question } = req.body;

            // if (!question) {
            //     return res.status(400).json({ error: 'Question is required' });
            // }

            const answer = await openAiRepository.ragQuery(
                'What is the main idea of this video bout?'
            );

            res.json({ answer });
        } catch (error) {
            console.error('Error in RAG query:', error);
            res.status(500).json({
                error: 'An error occurred while processing your request',
            });
        }
    });
    return router;
}
