import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatOllama } from "langchain/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

export class ChainService {
  static async createChain(
    ollamaLLM: ChatOllama
  ): Promise<RunnableSequence<Record<string, unknown>, string>> {
    const prompt = PromptTemplate.fromTemplate(
      process.env.PROMPT_TEMPLATE.toString()
    );

    return await createStuffDocumentsChain({
      llm: ollamaLLM,
      outputParser: new StringOutputParser(),
      prompt,
    });
  }
}
