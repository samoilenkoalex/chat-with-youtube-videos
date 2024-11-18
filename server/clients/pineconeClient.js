import { Pinecone } from '@pinecone-database/pinecone';

export class PineConeClient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error(
                'Pinecone API key is missing. Please set PINECONE_KEY in environment variables.'
            );
        }
        this.pineconeClient = new Pinecone({
            apiKey: apiKey,
        });
    }
}

export function initPineConeClient(apiKey) {
    return new PineConeClient(apiKey);
}
