import { Router, Response, Request } from "express";
import { HttpStatusEnum } from "./enums/http-status";
import { Counter } from "prom-client";

const routerHealth = Router();

const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["get", "health"],
});


routerHealth.get("/health", (req: Request, res: Response) => {
  requestCounter.labels(req.method, req.originalUrl).inc();
  return res
    .status(HttpStatusEnum.HTTP_STATUS_SUCESS)
    .json({ status: "App living" });
});

export default routerHealth;
