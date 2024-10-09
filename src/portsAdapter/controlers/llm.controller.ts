import { Router, Response, Request } from "express";
import multer from "multer";
import { container } from "../../main";
import EventEmitter from "events";
import { HttpStatusEnum } from "./enums/http-status";
import { RequestChat } from "./requests-dtos/request-chat.dto";
import { ProcessLLM } from "../../llm-training/llm-training.service";
const upload = multer({ dest: "/uploads", preservePath: true });

const routerLLM = Router();

routerLLM.post(
  "/upload-llm",
  upload.single("doc"),
  (req: Request, res: Response) => {
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
