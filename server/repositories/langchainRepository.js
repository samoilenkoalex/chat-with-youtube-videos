import 'dotenv/config';
import axios from 'axios';
import { LangchainCLient } from '../clients/langchainClient.js';
import { PineConeClient } from '../clients/pineconeClient.js';
import { PineconeStore } from '@langchain/pinecone';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import youtubedl from 'youtube-dl-exec';
import xml2js from 'xml2js';
import fs from 'fs';
import { PromptTemplate } from '@langchain/core/prompts';
import { configStore } from '../configs/configStore.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const youtubeCookiesPath = './youtube-cookies.json';
export class LangChainRepository {
    constructor() {
        this.langchainClient = null;
        this.pineconeClient = null;
        this.updateClients();
        this.ytDlpPath = path.resolve(__dirname, '..', 'yt-dlp');
    }

    updateClients() {
        const config = configStore.getConfig();
        if (config.openAiKey) {
            this.langchainClient = new LangchainCLient(config.openAiKey);
        }
        if (config.pineconeKey && config.pineconeIndex) {
            this.pineconeClient = new PineConeClient(
                config.pineconeKey,
                config.pineconeIndex
            );
        }
    }

    isConfigured() {
        return (
            this.langchainClient &&
            this.langchainClient.isConfigured &&
            this.pineconeClient &&
            this.pineconeClient.isConfigured
        );
    }

    async fetchYoutubeSubtitles(url) {
        if (!url) {
            throw new Error('URL is required');
        }

        try {
            const output = await youtubedl(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                subLang: 'en',
                writeAutoSub: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
                cookies: youtubeCookiesPath,
                binaryPath: this.ytDlpPath,
            });

            if (!output.automatic_captions?.en) {
                throw new Error('No English captions found for this video');
            }

            const captions = output.automatic_captions.en;
            const srv1Caption = captions.find(
                (caption) => caption.ext === 'srv1'
            );

            if (!srv1Caption) {
                throw new Error('srv1 caption format not found');
            }

            const response = await axios.get(srv1Caption.url);
            const xmlData = response.data;

            const filePath = './srv1_caption.xml';
            fs.writeFileSync(filePath, xmlData);

            const fileData = fs.readFileSync(filePath, 'utf8');

            return new Promise((resolve, reject) => {
                xml2js.parseString(fileData, (err, result) => {
                    if (err) {
                        reject(new Error('Failed to parse XML'));
                        return;
                    }

                    if (!result?.transcript?.text) {
                        reject(new Error('Invalid XML structure'));
                        return;
                    }

                    const texts = result.transcript.text
                        .map((text) => text._)
                        .join(' ');

                    resolve(texts);
                });
            });
        } catch (error) {
            console.error('Error in fetchYoutubeSubtitles:', error);
            throw error;
        }
    }

    async generateSummary(text) {
        const chatCompletion =
            await this.langchainClient.langchainClient.invoke(
                `Create short summary of the following text: ${text}`
            );
        return chatCompletion.content;
    }

    async fetchYoutubeSubtitles(url) {
        if (!url) {
            throw new Error('URL is required');
        }

        try {
            const output = await youtubedl(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                subLang: 'en',
                writeAutoSub: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
                cookies: youtubeCookiesPath,
            });

            console.log('yt-dlp output:', JSON.stringify(output, null, 2)); // Add this line

            if (!output.automatic_captions?.en) {
                throw new Error('No English captions found for this video');
            }

            const captions = output.automatic_captions.en;
            const srv1Caption = captions.find(
                (caption) => caption.ext === 'srv1'
            );

            if (!srv1Caption) {
                throw new Error('srv1 caption format not found');
            }

            const response = await axios.get(srv1Caption.url);
            const xmlData = response.data;

            return new Promise((resolve, reject) => {
                xml2js.parseString(xmlData, (err, result) => {
                    if (err) {
                        reject(new Error('Failed to parse XML'));
                        return;
                    }

                    if (!result?.transcript?.text) {
                        reject(new Error('Invalid XML structure'));
                        return;
                    }

                    const texts = result.transcript.text
                        .map((text) => text._)
                        .join(' ');

                    resolve(texts);
                });
            });
        } catch (error) {
            console.error('Error in fetchYoutubeSubtitles:', error);
            throw error;
        }
    }

    async generateEmbeddings(text) {
        return await this.langchainClient.embeddings.embedDocuments([text]);
    }
    async chatWithRag(question, chatHistory = [], topK = 3) {
        if (!configStore.isConfigured()) {
            throw new Error(
                'Configuration not set. Please call /fetch-subtitles first.'
            );
        }
        // Ensure clients are up-to-date with the latest configuration
        this.updateClients();

        try {
            const { answer, sourceDocuments } = await this.ragQuery(
                question,
                chatHistory,
                topK
            );

            chatHistory.push({ role: 'user', content: question });
            chatHistory.push({ role: 'assistant', content: answer });

            return {
                answer,
                sourceDocuments,
                chatHistory,
            };
        } catch (error) {
            console.error('Error in chat with RAG:', error);
            throw new Error('Failed to perform chat with RAG');
        }
    }
    async ragQuery(question, chatHistory = [], topK = 3) {
        if (!this.isConfigured()) {
            throw new Error('Clients are not configured. Please set API keys.');
        }
        try {
            const config = configStore.getConfig();
            const index = this.pineconeClient.pineconeClient.Index(
                config.pineconeIndex
            );

            const vectorStore = await PineconeStore.fromExistingIndex(
                this.langchainClient.embeddings,
                {
                    pineconeIndex: index,
                    filter: { videoId: config.currentVideoId },
                }
            );

            const safeTopK = Math.max(1, Math.floor(topK));

            const similarDocs = await vectorStore.similaritySearchWithScore(
                question,
                safeTopK
            );

            let processedDocs = similarDocs
                .filter(([doc, score]) => score >= 0.7)
                .map(
                    ([doc, score]) =>
                        new Document({
                            pageContent:
                                doc.metadata.fullText || doc.pageContent,
                            metadata: {
                                summary: doc.metadata.summary || '',
                                url: doc.metadata.url || '',
                                score: score,
                            },
                        })
                );

            if (processedDocs.length === 0) {
                const tavilyDocs = await this.tavilySearch(question, topK);
                processedDocs = tavilyDocs.map(
                    (doc) =>
                        new Document({
                            pageContent: doc.content,
                            metadata: {
                                summary: doc.snippet,
                                url: doc.url,
                                score: 1,
                            },
                        })
                );
            }

            if (processedDocs.length === 0) {
                return {
                    answer: 'No matching results found.',
                    sourceDocuments: [],
                };
            }

            const formattedHistory = chatHistory
                .map((msg) => `${msg.role}: ${msg.content}`)
                .join('\n');

            const prompt = PromptTemplate.fromTemplate(`
            You are an assistant, answer questions on the following context strictly.

            Context: {context}

            Chat History: {chat_history}

            Question: {question} `);

            const llm = this.langchainClient.langchainClient;

            const ragChain = await createStuffDocumentsChain({
                llm,
                prompt,
                outputParser: new StringOutputParser(),
                document_variable_name: 'context',
            });

            const response = await ragChain.invoke({
                question: question,
                chat_history: formattedHistory,
                context: processedDocs,
            });
            console.log('response >>>>:', response);
            console.log(
                'response >>>>:',
                processedDocs.map((doc) => ({
                    content: doc.pageContent,
                    metadata: doc.metadata,
                }))
            );
            return {
                answer: response,
                sourceDocuments: processedDocs.map((doc) => ({
                    content: doc.pageContent,
                    metadata: doc.metadata,
                })),
            };
        } catch (error) {
            console.error('Error in RAG query:', error);
            throw new Error('Failed to perform RAG query');
        }
    }

    async tavilySearch(query, max_results = 3) {
        const config = configStore.getConfig();

        try {
            const response = await axios.post('https://api.tavily.com/search', {
                api_key: config.tavilyApiKey,
                query: query,
                max_results: max_results,
                search_depth: 'advanced',
                include_answer: true,
            });

            return response.data.results;
        } catch (error) {
            console.error('Error in Tavily search:', error);
            return [];
        }
    }

    async implementFetchSubtitles(url) {
        try {
            const texts = await this.fetchYoutubeSubtitles(url);
            const summary = await this.generateSummary(texts);

            const textSplitter = new CharacterTextSplitter({
                separator: ' ',
                chunkSize: 2000,
                chunkOverlap: 400,
            });

            const textChunks = await textSplitter.splitText(texts);
            const vectorEmbeddings = await Promise.all(
                textChunks.map((chunk) => this.generateEmbeddings(chunk))
            );

            const index = this.pineconeClient.getIndex();

            const videoId = this.extractYoutubeId(url) || `video_${Date.now()}`;

            const vectors = textChunks.map((chunk, i) => ({
                id: `${videoId}_chunk_${i}`,
                values: vectorEmbeddings[i][0],
                metadata: {
                    videoId: videoId,
                    url: url,
                    summary: summary,
                    fullText: chunk,
                    chunkIndex: i,
                },
            }));

            const upsertResponse = await index.upsert(vectors);

            // Update configStore with the new videoId
            const config = configStore.getConfig();
            configStore.updateConfig({
                ...config,
                currentVideoId: videoId,
            });

            return { summary, upsertResponse, videoId };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Failed to process and store subtitles');
        }
    }

    extractYoutubeId(url) {
        const regExp =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[7].length === 11 ? match[7] : null;
    }
}
