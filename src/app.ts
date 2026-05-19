import express from "express";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.ts";
import router from "./routes.ts";
import { sessionMidleware } from "./middlewares/session.midleware.ts";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
//middleware para los request 
app.use(express.json());
//configura el middleware para las sessiones 
app.use(sessionMidleware);
app.use("/api", router);

// Aqui se ponen los middlewares de error
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
