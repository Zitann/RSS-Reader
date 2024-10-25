import express from "express";
import Result from "../utils/result";
import { prisma } from "../lib/prisma";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const router = express.Router();

const encodePassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

interface UserRegister {
  username: string;
  email: string;
  password: string;
  repassword: string;
}

router.post(
  "/register",
  async (req: express.Request<unknown, unknown, UserRegister>, res) => {
    const { username, email, password, repassword } = req.body;
    if (!username || !email || !password || !repassword) {
      res.send(Result.fail("参数错误"));
      return;
    }
    if (password !== repassword) {
      res.send(Result.fail("两次密码不一致"));
      return;
    }

    // 检查用户是否已经注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.send(Result.fail("用户已注册"));
      return;
    }

    // 注册新用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: encodePassword(password),
      },
    });

    res.send(Result.success(user, "注册成功"));
    return;
  },
);

interface UserLogin {
  email: string;
  password: string;
}

router.post(
  "/login",
  async (req: express.Request<unknown, unknown, UserLogin>, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send(Result.fail("参数错误"));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.send(Result.fail("用户不存在"));
      return;
    }

    if (user.password !== encodePassword(password)) {
      res.send(Result.fail("密码错误"));
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "secret",
      {
        expiresIn: "1h",
        algorithm: "HS256",
      },
    );

    res.send(Result.success({ user, token }, "登录成功"));
    return;
  },
);

export default router;
