import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document, DocumentInterface } from "@langchain/core/documents";

export class DatabaseVectorQdrant {
  private static async fromExistCollection(): Promise<QdrantVectorStore> {
    return await QdrantVectorStore.fromExistingCollection(
      new OllamaEmbeddings({ model: process.env.MODEL_LLM }),
      {
        url: process.env.QDRANT_URL,
        collectionName: process.env.COLLECTION_NAME,
      }
    );
  }

  static async addDocuments(documents: Document<Record<string, any>>[]) {
    const collection = await DatabaseVectorQdrant.fromExistCollection();
    await collection.addDocuments(documents);
  }

  static async getDocuments(search: string): Promise<DocumentInterface[]> {
    const collection = await DatabaseVectorQdrant.fromExistCollection();
    return await collection.similaritySearch(search);
  }
}
