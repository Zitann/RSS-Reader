import express from "express";
import { expressjwt } from "express-jwt";
// 导入cors
import cors from "cors";
import userRouter from "./routes/user";
import feedRouter from "./routes/feed";
import articleRouter from "./routes/article";
import tagRouter from "./routes/tag";
import opmlRouter from "./routes/opml";

import Parser from "rss-parser";
import job from "./utils/parse";

const app = express();
const PORT = process.env.PORT || 3050;

app.use(express.json());
app.use(cors());

app.use(
  expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/login",
      "/register",
      "/parser",
      { url: /.*\.opml$/, methods: ["GET"] },
    ],
  }),
);

app.use(express.static("public"));

app.use("/", userRouter);
app.use("/feed", feedRouter);
app.use("/article", articleRouter);
app.use("/tag", tagRouter);
app.use("/opml", opmlRouter);

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
