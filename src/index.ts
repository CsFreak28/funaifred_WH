import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app: Express = express();
let port = process.env.PORT;
app.get("/", async (request: Request, response: Response) => {
  response.status(200);
  response.send("i am connected");
});
app.listen(port || 8000, () => {
  console.log("i am listening bro", port);
  console.log("samson");
});
