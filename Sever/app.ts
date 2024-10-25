import express from "express";
import { expressjwt } from "express-jwt";

import { prisma } from "./lib/prisma";

import userRouter from "./routes/user";
import feedRouter from "./routes/feed";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: ["/login", "/register"],
  }),
);

app.use("/", userRouter);
app.use("/feed", feedRouter);

app.get("/", async (req, res) => {
  const count = await prisma.user.count();
  console.log(count);
  res.send("Hello, TypeScript and Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
