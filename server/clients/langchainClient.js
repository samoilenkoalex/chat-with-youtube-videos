import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import youtubedl from 'youtube-dl-exec';
import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';

export class LangchainCLient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error(
                'Langchain API key is missing. Please set OPENAI_KEY in environment variables.'
            );
        }
        this.langchainClient = new ChatOpenAI({
            apiKey: apiKey,
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
        });
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: apiKey,
        });
    }

    getChatModel() {
        return this.langchainClient;
    }
}

export function initLangchainCLient(apiKey) {
    return new LangchainCLient(apiKey);
}
