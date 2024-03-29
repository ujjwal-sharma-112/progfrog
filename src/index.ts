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
  await prisma
    .$connect()
    .then(() => {
      console.log("Database Connected 🚀");
    })
    .catch((e) => {
      console.log(e);
    });
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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on port ${PORT}.`);
});
