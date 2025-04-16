import { Request, Response } from "express";
import next from "next";
import apiServer from "./api";

// ref: https://github.com/vercel/next.js/blob/canary/examples/custom-server/server.ts
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // 處理所有其他請求
  apiServer.all("*path", (req: Request, res: Response) => {
    return handle(req, res);
  });

  apiServer.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
