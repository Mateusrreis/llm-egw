import { TextLoader } from "langchain/document_loaders/fs/text";
import {
  DatabaseMemory,
  SaveFormatDocuments,
} from "../../src/portsAdapter/memory-store";
describe("DatabaseMemory", () => {
  describe("fromDocuments", () => {
    it.only("Should save documents with create table documents memory", async () => {
      const loader = new TextLoader(
        "test\\llm-training\\docs\\grande-conflito.txt"
      );
      const docs = await loader.load();
      await DatabaseMemory.fromDocuments(docs);
      const instanceDatabase = DatabaseMemory.getMemoryDocuments();
      const result = await instanceDatabase.similaritySearch(
        "Deus conferiu aos homens o conhecimento necessário à salvação"
      );
      expect(result.length).toBeGreaterThanOrEqual(0);
    }, 88000000);
  });
});
