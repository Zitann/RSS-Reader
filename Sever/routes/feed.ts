import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";
import Parser from "rss-parser";

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
    const feedList = await prisma.feed.findMany({
      where: {
        users: {
          some: {
            user_id: id,
          },
        },
        tag_id: tag_id ? parseInt(tag_id) : undefined,
      },
      orderBy: {
        updated_at: "desc",
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
  const feed = await prisma.feed.findUnique({
    where: {
      id: parseInt(id) ?? undefined,
    },
  });

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
    const { title, description } = await parser.parseURL(url);
    const feed = await prisma.feed.create({
      data: {
        url,
        tag_id,
        title,
        description,
        updated_at: new Date(),
        users: {
          create: {
            user_id: user.id,
          },
        },
      },
    });

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
    const feed = await prisma.feed.update({
      where: {
        id: parseInt(id),
      },
      data: {
        tag_id,
        updated_at: new Date(),
      },
    });

    res.send(Result.success(feed));
    return;
  },
);

export default router;
