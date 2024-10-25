import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";

const router = express.Router();

interface User {
  id: number;
  email: string;
}

declare module "express" {
  interface Request {
    auth?: User;
  }
}

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

export default router;
