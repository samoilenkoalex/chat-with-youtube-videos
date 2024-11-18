import 'dotenv/config';
import { LangchainCLient } from '../clients/langchainClient.js';
import { PineConeClient } from '../clients/pineconeClient.js';

export class OpenAiRepository {
    constructor(langchainClient, pineconeClient) {
        if (!(langchainClient instanceof LangchainCLient)) {
            throw new Error('Invalid LangchainClient instance');
        }

        if (!(pineconeClient instanceof PineConeClient)) {
            throw new Error('Invalid PineconeClient instance');
        }
        this.langchainClient = langchainClient;

        this.pineconeClient = pineconeClient;
    }

    async implementChat(query) {
        try {
            const llm = this.langchainClient.getChatModel();

            const result = await llm.invoke(query || 'Hello, world!');
            console.log('Chat result:', result);
            return result;
        } catch (error) {
            console.error('Error in OpenAiRepository:', error);
            throw error;
        }
    }

    async implementFetchSubtitles(url) {
        try {
            const texts = await this.langchainClient.fetchYoutubeSubtitles(url);
            const summary = await this.langchainClient.generateSummary(texts);
            const vectorEmbeddings =
                await this.langchainClient.generateEmbeddings(texts);

            // Get Pinecone index
            const index = this.pineconeClient.pineconeClient.Index(
                process.env.PINECONE_INDEX
            );

            // Prepare vector for upsert
            const vector = {
                id: `youtube_${url}`,
                values: vectorEmbeddings[0],
                metadata: {
                    url: url,
                    summary: summary,
                    fullText: texts,
                },
            };

            // Upsert to Pinecone
            const upsertResponse = await index.upsert([vector]);

            return { summary, upsertResponse };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to process and store subtitles');
        }
    }
}
