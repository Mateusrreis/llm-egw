import { CharacterTextSplitter } from "langchain/text_splitter";
import { ProcessLLM } from "../../src/llm-training/llm-training.service";
import { ChatOllama } from "langchain/chat_models/ollama";

import { mock, mockClear } from "jest-mock-extended";
describe("ProcessLLM", () => {
  describe("loadLLMDocuments", () => {
    const textSplitter = mock<CharacterTextSplitter>();
    const mockChatOllama = mock<ChatOllama>();

    beforeEach(() => {
      mockClear(textSplitter);
      mockClear(mockChatOllama);
    });

    it("Should give chain load documents in memory", async () => {
      const textCharacter = new CharacterTextSplitter({
        chunkOverlap: 2,
        chunkSize: 5,
      });
      const processLLM = new ProcessLLM(mockChatOllama);
      const loadDoc = await processLLM.loadLLMDocuments(
        "test\\llm-training\\docs\\grande-conflito.txt"
      );
      expect(loadDoc).not.toBeNull();
    }, 80000000);

    it("Should test error loadLLMDocuments", async () => {
      textSplitter.splitDocuments.mockImplementation(() => {
        throw new Error("Teste");
      });

      const processLLM = new ProcessLLM(mockChatOllama);
      expect(async () => {
        await processLLM.loadLLMDocuments(
          "test\\llm-training\\docs\\grande-conflito.txt"
        );
      }).rejects.toThrow(Error);
    });
  });
});
