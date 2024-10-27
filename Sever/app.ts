import express from "express";
import { expressjwt } from "express-jwt";

import userRouter from "./routes/user";
import feedRouter from "./routes/feed";
import Parser from "rss-parser";
import job from "./utils/parse";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: ["/login", "/register", "/parser"],
  }),
);

app.use("/", userRouter);
app.use("/feed", feedRouter);

job.invoke();

const parser = new Parser();

app.get("/parser", async (req, res) => {
  const feed = await parser.parseURL("https://sspai.com/feed");
  console.log(feed.title);
  res.send(feed.items[0].contentSnippet);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.on("close", () => {
  job.cancel();
});