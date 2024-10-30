import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.send(Result.success(tags));
  return;
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const tag = await prisma.tag.create({
    data: {
      name,
    },
  });
  res.send(Result.success(tag));
  return;
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.send(Result.fail("参数错误"));
    return;
  }
  const tag = await prisma.tag.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.send(Result.success(tag));
  return;
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const tag = await prisma.tag.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
    },
  });
  res.send(Result.success(tag));
  return;
});

export default router;
