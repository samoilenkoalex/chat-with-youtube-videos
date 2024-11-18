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
        try {
            const { url } = req.body;
            const result = await openAiRepository.implementFetchSubtitles(
                ''
            );
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    });
    return router;
}
