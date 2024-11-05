import { Router, Response, Request } from "express";
import multer from "multer";
import { container } from "../../main";
import EventEmitter from "events";
import { HttpStatusEnum } from "./enums/http-status";
import { RequestChat } from "./requests-dtos/request-chat.dto";
import { ProcessLLM } from "../../llm-training/llm-training.service";
import { Counter } from "prom-client";
const upload = multer({ dest: "/uploads", preservePath: true });

const routerLLM = Router();

const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["post", "llm"],
});

routerLLM.post(
  "/upload-llm",
  upload.single("doc"),
  (req: Request, res: Response) => {
    requestCounter.labels(req.method, req.originalUrl).inc();
    if (req.file == null) {
      res
        .status(HttpStatusEnum.BAD_REQUEST)
        .json({ status: "Request invalid" });
    }
    const eventEmitter = container.resolve<EventEmitter>("eventEmitter");
    eventEmitter.emit("learning-documentation", req.file);
    res
      .status(HttpStatusEnum.HTTP_STATUS_SUCESS)
      .json({ status: "Upload realizado com sucesso" });
  }
);

routerLLM.post("/chat", async (req: Request, res: Response) => {
  requestCounter.labels(req.method, req.originalUrl).inc();
  const chat = req.body as RequestChat;
  if (!chat.question)
    res
      .status(HttpStatusEnum.BAD_REQUEST)
      .json({ status: "Requisição invalida" });

  const process = container.resolve<ProcessLLM>("processLLM");
  const responseChat = await process.invokeLLM(chat.question);
  res.status(HttpStatusEnum.HTTP_STATUS_SUCESS).json(responseChat);
});

export default routerLLM;
