import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import youtubedl from 'youtube-dl-exec';
import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';

export class LangchainCLient {
    constructor(apiKey) {
        // Initialize isConfigured to false by default
        this.isConfigured = false;

        if (!apiKey) {
            console.warn('No API key provided to LangchainClient');
            return;
        }

        try {
            this.langchainClient = new ChatOpenAI({
                apiKey: apiKey,
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
            });

            this.embeddings = new OpenAIEmbeddings({
                openAIApiKey: apiKey,
            });

            // Test the client configuration
            if (this.langchainClient && this.embeddings) {
                this.isConfigured = true;
            } else {
                throw new Error(
                    'Failed to initialize LangchainClient components'
                );
            }
        } catch (error) {
            console.error('Error configuring LangchainClient:', error);
            this.isConfigured = false;
            throw error;
        }
    }
}
