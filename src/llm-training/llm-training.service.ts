import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DatabaseVectorQdrant } from "../portsAdapter/database/qdrant/database.vector";
import { ChainService } from "./chain/chain.service";

export class ProcessLLM {
  constructor(private ollamaLLM: ChatOllama) {}

  async loadLLMDocuments(filePath: Express.Multer.File) {
    try {
      const loader = new TextLoader(filePath.path);
      const docs = await loader.load();
      const textSplitter = new RecursiveCharacterTextSplitter({
        separators: ["\r\n", "Capitulo"],
        chunkOverlap:  parseInt(process.env.CHUNK_OVERLAP),
        chunkSize: parseInt(process.env.CHUNK_SIZE),
      });
      const splits = await textSplitter.splitDocuments(docs);
      splits.map(e => e.metadata.source = filePath.originalname)
      await DatabaseVectorQdrant.addDocuments(splits);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        throw new Error(`Error to load documents to LLM`);
      }
    }
  }

  async invokeLLM(question: string) {
    const chain = await ChainService.createChain(this.ollamaLLM);
    const memory = await DatabaseVectorQdrant.getDocuments(question);
    const response = await chain.invoke({
      context: memory,
      question: question,
    });

    return response;
  }
}
