import express from "express";
import organizationsRouter from "./organizations";

const app = express();

app.use("/api/organizations", organizationsRouter);

export default app;
