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

    async fetchYoutubeSubtitles(url) {
        if (!url) {
            throw new Error('URL is required');
        }

        const output = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            subLang: 'en',
            writeAutoSub: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
        });

        const captions = output.automatic_captions.en;
        const srv1Caption = captions.find((caption) => caption.ext === 'srv1');

        if (!srv1Caption) {
            throw new Error('srv1 caption not found');
        }

        const response = await axios.get(srv1Caption.url);
        const xmlData = response.data;

        // Write the XML data to a local file
        const filePath = './srv1_caption.xml';
        fs.writeFileSync(filePath, xmlData);

        // Read and parse the local file
        const fileData = fs.readFileSync(filePath, 'utf8');

        return new Promise((resolve, reject) => {
            xml2js.parseString(fileData, (err, result) => {
                if (err) {
                    reject(new Error('Failed to parse XML'));
                    return;
                }

                const texts = result.transcript.text
                    .map((text) => text._)
                    .join(' ');

                resolve(texts);
            });
        });
    }

    async generateSummary(text) {
        const chatCompletion = await this.langchainClient.invoke(
            `Create short summary of the following text: ${text}`
        );
        return chatCompletion.content;
    }

    async generateEmbeddings(text) {
        return await this.embeddings.embedDocuments([text]);
    }
}

export function initLangchainCLient(apiKey) {
    return new LangchainCLient(apiKey);
}
