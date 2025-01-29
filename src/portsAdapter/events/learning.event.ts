import EventEmitter from "events";
import { ProcessLLM } from "../../llm-training/llm-training.service";

export class LearningEventHandlers {
  constructor(
    private eventEmitter: EventEmitter,
    private processLLM: ProcessLLM
  ) {}

  registerRouteEventHandlers() {
    console.log("Inicializando os eventos da aplicação");
    this.eventEmitter.on("learning-documentation", async (pathFile) => {
      await this.processLLM.loadLLMDocuments(pathFile);
    });
  }
}
