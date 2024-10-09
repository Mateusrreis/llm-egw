import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Document } from "@langchain/core/documents";

export type DocumentRegister = {
  id: number;
};

export type SaveFormatDocuments = {
  text: string[];
  metadata: DocumentRegister[];
};

export class DatabaseMemory {
  private static memory: MemoryVectorStore;

  static async fromDocuments(spliterDocs: Document<Record<string, any>>[]) {
    if(!this.memory){
      this.memory = await MemoryVectorStore.fromDocuments(
        spliterDocs,
        new OllamaEmbeddings({ model: "llama3" })
      );
      return;
    }
    await this.memory.addDocuments(spliterDocs);
  }

  static getMemoryDocuments(): MemoryVectorStore {
    return this.memory;
  }
}
