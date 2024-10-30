import Parser from "rss-parser";
import { prisma } from "../lib/prisma";
import schedule from "node-schedule";
import { Feed, UserSubscription } from "@prisma/client";

const parser = new Parser();

export const updateArticleBySubscription = async (
  subscription: UserSubscription & Record<"feed", Feed>,
) => {
  const {
    feed: { url, id },
    user_id,
  } = subscription;
  try {
    const result = await parser.parseURL(url);
    for (const item of result.items) {
      const { title, link, pubDate, contentSnippet, content } = item;
      const article = await prisma.article.findFirst({
        where: {
          link,
        },
      });
      if (!article) {
        await prisma.article.create({
          data: {
            title: title ?? "",
            link: link ?? "",
            content: content,
            description: contentSnippet,
            published_at: pubDate ? new Date(pubDate) : new Date(),
            feed_id: id,
            statuses: {
              create: {
                user_id: user_id,
                updated_at: new Date(),
              },
            },
          },
        });
      } else {
        break;
      }
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const updateArticle = async () => {
  console.log("updateArticle");
  const subscrptionList = await prisma.userSubscription.findMany({
    include: {
      feed: true,
    },
  });
  for (const subscription of subscrptionList) {
    try {
      await updateArticleBySubscription(subscription);
    } catch (error) {
      console.log(error);
      continue;
    }
  }
};

// 每小时更新一次文章
const job = schedule.scheduleJob("0 * * * *", updateArticle);

export default job;
