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
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(
  expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/",
      "/home",
      "/login",
      "/register",
      "/parser",
      { url: /.*\.opml$/, methods: ["GET"] },
      // CSS, JS, images
      { url: /.*\.(css|js|png|jpg|jpeg|gif|svg|ico)$/, methods: ["GET"] },
    ],
  }),
);

app.use(express.static("public"));

app.use("/", userRouter);
app.use("/feed", feedRouter);
app.use("/article", articleRouter);
app.use("/tag", tagRouter);
app.use("/opml", opmlRouter);

// 静态资源目录
app.use(express.static(path.join(__dirname, "dist")));

// 处理所有路由请求
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

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
