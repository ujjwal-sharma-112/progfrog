import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";

import Express from "express";

const app = Express();

import authRouter from "./Routes/auth";
import postRouter from "./Routes/post";
import communityRouter from "./Routes/community";
import prisma from "../prisma/prisma";
import userRouter from "./Routes/user";

async function main() {
  await prisma.$connect();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/community", communityRouter);
app.use("/api/user", userRouter);

app.listen(4000 || process.env.PORT, () => {
  console.log("🚀 Server is up and running on port 4000.");
});
