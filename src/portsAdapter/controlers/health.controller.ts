import { Router, Response, Request } from "express";
import { HttpStatusEnum } from "./enums/http-status";

const routerHealth = Router();

routerHealth.get("/health", (req: Request, res: Response) => {
  return res
    .status(HttpStatusEnum.HTTP_STATUS_SUCESS)
    .json({ status: "App living" });
});

export default routerHealth;
