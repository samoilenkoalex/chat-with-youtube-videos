import { Pinecone } from '@pinecone-database/pinecone';

export class PineConeClient {
    constructor(apiKey, indexName) {
        if (!apiKey || !indexName) {
            this.isConfigured = false;
            return;
        }
        this.isConfigured = true;
        this.pineconeClient = new Pinecone({
            apiKey: apiKey,
        });
        this.indexName = indexName;
    }

    getIndex() {
        if (!this.isConfigured) {
            throw new Error(
                'Pinecone client is not configured. Please set the API key and index name.'
            );
        }
        return this.pineconeClient.Index(this.indexName);
    }
}

export function initPineConeClient(apiKey) {
    return new PineConeClient(apiKey);
}
