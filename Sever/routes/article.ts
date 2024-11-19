import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";

const router = express.Router();

interface ArticleListQuery {
  tag_id?: string;
  feed_id?: string;
  is_read?: string;
  is_favorited?: string;
}

router.get(
  "/",
  async (
    req: express.Request<unknown, unknown, unknown, ArticleListQuery>,
    res,
  ) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { id } = user;
    const { tag_id, feed_id, is_read, is_favorited } = req.query;
    const statusList = await prisma.userArticleStatus.findMany({
      where: {
        user_id: id,
        article: {
          feed_id: feed_id ? parseInt(feed_id) : undefined,
          feed: {
            users: {
              some: {
                tag_id: tag_id ? parseInt(tag_id) : undefined,
              },
            },
          },
        },
        is_read: is_read ? is_read === "true" : undefined,
        is_favorited: is_favorited ? is_favorited === "true" : undefined,
      },
      select: {
        article: {
          select: {
            id: true,
            title: true,
            link: true,
            feed_id: true,
            feed: {
              select: {
                title: true,
              },
            },
          },
        },
        is_read: true,
        is_favorited: true,
      },
      orderBy: {
        article: {
          published_at: "desc",
        },
      },
    });

    console.log(statusList);

    res.send(Result.success(statusList));
    return;
  },
);

interface ArticleParams {
  id: string;
}

router.get("/:id", async (req: express.Request<ArticleParams>, res) => {
  const user = req.auth;
  if (!user) {
    res.send(Result.fail("用户未登录"));
    return;
  }

  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: {
      id: parseInt(id) ?? undefined,
      statuses: {
        some: {
          user_id: user.id,
        },
      },
    },
    select: {
      id: true,
      title: true,
      link: true,
      feed_id: true,
      feed: {
        select: {
          title: true,
        },
      },
      content: true,
      statuses: {
        select: {
          user_id: true,
          is_read: true,
          is_favorited: true,
          user: {
            select: {
              subscriptions: {
                select: {
                  tag_id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  res.send(Result.success(article));
  return;
});

interface ArticleBody {
  article_id: number[];
  is_read: boolean;
  is_favorited: boolean;
}

router.put(
  "/",
  async (req: express.Request<ArticleParams, unknown, ArticleBody>, res) => {
    const user = req.auth;
    if (!user) {
      res.send(Result.fail("用户未登录"));
      return;
    }

    const { is_read, is_favorited, article_id } = req.body;

    const count = await prisma.userArticleStatus.updateMany({
      where: {
        user_id: user.id,
        article_id: {
          in: article_id,
        },
      },
      data: {
        is_read,
        is_favorited,
      },
    });

    res.send(Result.success(count));
    return;
  },
);

export default router;
