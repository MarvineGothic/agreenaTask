import express, { Express } from "express";
import { handleErrorMiddleware } from "middlewares/error-handler.middleware";
import v1 from "routes/v1";

export function setupServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", v1);
  app.use(handleErrorMiddleware);

  return app;
}
