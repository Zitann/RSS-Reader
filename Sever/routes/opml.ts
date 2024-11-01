import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";
import { Feed } from "@prisma/client";
import fs from "fs";
import { v4 } from "uuid";
import fileUpload, { UploadedFile } from "express-fileupload";
import Parser from "rss-parser";
import { parseString } from "xml2js";

const parser = new Parser({
  timeout: 10000,
});

const router = express.Router();

interface OpmlQuery {
  tag_id: string;
}

function generateOpml(rssFeeds: Feed[]) {
  let opmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <opml version="1.0">
    <head>
    <title>My Feeds</title>
    </head>
    <body>\n`;

  // 遍历RSS订阅源，添加到OPML内容中
  rssFeeds.forEach((feed) => {
    opmlContent += `    <outline text="${feed.title}" type="rss" xmlUrl="${feed.url}" />\n`;
  });

  // 结束OPML文档
  opmlContent += "</body></opml>";

  return opmlContent;
}

router.get(
  "/",
  async (req: express.Request<unknown, unknown, unknown, OpmlQuery>, res) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { id } = user;
    const { tag_id } = req.query;

    const subscriptionList = await prisma.userSubscription.findMany({
      select: {
        feed: true,
      },
      where: {
        user_id: id,
        tag_id: tag_id ? parseInt(tag_id) : undefined,
      },
    });

    const feedList = subscriptionList.map((subscription) => {
      return subscription.feed;
    });

    const opmlContent = generateOpml(feedList);

    // 生成uuid
    const file_id = v4();

    // 保存OPML文件
    fs.writeFileSync(`public/${file_id}.opml`, opmlContent);

    res.send(Result.success(`/${file_id}.opml`));
    return;
  },
);

interface OpmlBody {
  tag_id: string;
}

router.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
);

interface Outline {
  $: {
    xmlUrl: string;
    title: string;
  };
  outline?: Outline[];
}

async function addFeed(outline: Outline, user_id: number, tag_id: number) {
  const { xmlUrl, title } = outline.$;
  if (!xmlUrl || !xmlUrl.startsWith("http")) {
    return;
  }

  try {
    // 判断是否在数据库中已经存在
    let existFeed = await prisma.feed.findFirst({
      where: {
        url: xmlUrl,
      },
    });

    const feed = await parser.parseURL(xmlUrl);
    const { description } = feed;

    if (!existFeed) {
      existFeed = await prisma.feed.create({
        data: {
          url: xmlUrl,
          title: title,
          description: description,
        },
      });
    }

    // 判断是否已经订阅
    const existSubscription = await prisma.userSubscription.findUnique({
      where: {
        user_id_feed_id: {
          user_id: user_id,
          feed_id: existFeed.id,
        },
      },
    });

    if (!existSubscription) {
      await prisma.userSubscription.create({
        data: {
          user_id: user_id,
          feed_id: existFeed.id,
          tag_id,
        },
      });
    }
    console.log("添加成功");
  } catch (error) {
    console.log(error);
    return;
  }
  return;
}

async function parseOutline(outline: Outline, user_id: number, tag_id: number) {
  if (outline.outline) {
    for (const subOutline of outline.outline) {
      await parseOutline(subOutline, user_id, tag_id);
    }
  } else {
    await addFeed(outline, user_id, tag_id);
  }
}

router.post(
  "/",
  async (req: express.Request<unknown, unknown, OpmlBody>, res) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { id } = user;

    const { tag_id } = req.body;

    // 获取OPML文件
    const files = req.files;

    if (!files) {
      res.send(Result.fail("未上传文件"));
      return;
    }

    const file = files.opml as UploadedFile;

    const opmlContent = file.data.toString();

    parseString(opmlContent, async (err, result) => {
      if (err) {
        console.log(err);
        res.send(Result.fail("解析失败"));
        return;
      }
      try {
        const outlines = result.opml.body[0].outline;
        for (const outline of outlines) {
          await parseOutline(outline, id, tag_id ? parseInt(tag_id) : 1);
        }
        console.log("上传成功");
        res.send(Result.success("上传成功"));
      } catch (error) {
        console.log(error);
        res.send(Result.fail("解析失败"));
        return;
      }
    });
  },
);

export default router;
