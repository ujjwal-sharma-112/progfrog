import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";

import Express from "express";

const app = Express();

import router from "./Routes/auth";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", router);

app.listen(4000, () => {
  console.log("🚀 Server is up and running on port 4000.");
});
