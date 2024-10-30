import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";
import Parser from "rss-parser";
import { updateArticleBySubscription } from "../utils/parse";

const router = express.Router();
const parser = new Parser();

interface FeedListQuery {
  tag_id: string;
}

router.get(
  "/",
  async (
    req: express.Request<unknown, unknown, unknown, FeedListQuery>,
    res,
  ) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { id } = user;
    const { tag_id } = req.query;
    console.log(typeof tag_id);
    const feedList = await prisma.userSubscription.findMany({
      select: {
        feed: true,
        tag_id: true,
      },
      where: {
        user_id: id,
        tag_id: tag_id ? parseInt(tag_id) : undefined,
      },
    });

    res.send(Result.success(feedList));
    return;
  },
);

interface FeedParams {
  id: string;
}

router.get("/:id", async (req: express.Request<FeedParams>, res) => {
  const user = req.auth;
  if (!user) {
    res.send(Result.fail("用户未登录"));
    return;
  }

  const { id } = req.params;
  const feed = await prisma.userSubscription.findFirst({
    select: {
      feed: true,
    },
    where: {
      user_id: user.id,
      feed_id: id ? parseInt(id) : undefined,
    },
  });

  if (!feed) {
    res.send(Result.fail("未找到订阅"));
    return;
  }

  res.send(Result.success(feed));
  return;
});

router.delete("/:id", async (req: express.Request<FeedParams>, res) => {
  const user = req.auth;
  if (!user) {
    res.send(Result.fail("用户未登录"));
    return;
  }

  const { id } = req.params;
  await prisma.userSubscription.delete({
    select: {
      feed_id: true,
    },
    where: {
      user_id_feed_id: {
        feed_id: parseInt(id),
        user_id: user.id,
      },
    },
  });

  res.send(Result.success(null));
  return;
});

interface FeedBody {
  url: string;
  tag_id: number;
}

router.post(
  "/",
  async (req: express.Request<unknown, unknown, FeedBody>, res) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { url, tag_id } = req.body;
    // 检测数据库中是否已经存在该订阅
    let feed = await prisma.feed.findFirst({
      where: {
        url: url,
      },
    });

    // 检测链接是否有效
    try {
      await parser.parseURL(url);
    } catch (error) {
      console.log(error);
      res.send(Result.fail("链接无效"));
      return;
    }

    // 如果不存在则创建
    if (!feed) {
      const { title, description } = await parser.parseURL(url);
      feed = await prisma.feed.create({
        data: {
          url,
          title,
          description,
        },
      });
    }

    // 是否已经订阅
    let subscription = await prisma.userSubscription.findFirst({
      where: {
        user_id: user.id,
        feed_id: feed.id,
      },
      include: {
        feed: true,
      },
    });

    if (subscription) {
      res.send(Result.fail("已经订阅"));
      return;
    }

    subscription = await prisma.userSubscription.create({
      data: {
        user_id: user.id,
        feed_id: feed.id,
        tag_id,
      },
      include: {
        feed: true,
      },
    });

    try {
      await updateArticleBySubscription(subscription);
    } catch (error) {
      res.send(Result.fail(error));
      return;
    }

    res.send(Result.success(feed));
    return;
  },
);

router.put(
  "/:id",
  async (req: express.Request<FeedParams, unknown, FeedBody>, res) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { id } = req.params;
    const { tag_id } = req.body;
    const feed = await prisma.userSubscription.update({
      select: {
        feed: true,
      },
      where: {
        user_id_feed_id: {
          feed_id: parseInt(id),
          user_id: user.id,
        },
      },
      data: {
        tag_id,
      },
    });

    res.send(Result.success(feed));
    return;
  },
);

export default router;
