import express from "express";
import * as awilix from "awilix";
import { ProcessLLM } from "./llm-training/llm-training.service";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { EventEmitter } from "events";
import { LearningEventHandlers } from "./portsAdapter/events/learning.event";
import routerLLM from "./portsAdapter/controlers/llm.controller";
import routerHealth from "./portsAdapter/controlers/health.controller";

const app = express();

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
});
app.use(express.json(), routerLLM, routerHealth);

app.listen("3000", async () => {
  injectionDependencies();
  const learning = container.resolve<LearningEventHandlers>("learningEvent");
  learning.registerRouteEventHandlers();
  console.log("Servidor rodando na porta 3000");
});

function injectionDependencies() {
  container
    .register({
      processLLM: awilix.asClass(ProcessLLM, {
        lifetime: awilix.Lifetime.SCOPED,
      }),
    })
    .register({
      ollamaLLM: awilix.asValue(
        new ChatOllama({
          baseUrl: process.env.BASE_URL_LLM.toString(),
          model: process.env.MODEL_LLM.toString(),
          temperature: Number.parseFloat(process.env.TEMPERATURE.toString()),
        })
      ),
    })
    .register({
      learningEvent: awilix.asClass(LearningEventHandlers, {
        lifetime: awilix.Lifetime.SCOPED,
      }),
    })
    .register({
      eventEmitter: awilix.asValue(new EventEmitter()),
    })
}
