import { Router, Response, Request } from "express";
import prisma from "../../prisma/prisma";

import * as bcrypt from 'bcrypt';

import { loginValidator, signUpValidator } from "../validator";

const authRouter = Router();

/**
 *
 *
 *
 *
 * * SIGNUP ROUTE
 *
 *
 *
 *
 */
authRouter.post("/signup", async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  const { error } = signUpValidator(body);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    // Checking if email exists or not
    const emailExists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (emailExists) {
      return res.status(400).send({
        message: `User with email ${body.email} already exists`,
      });
    }

    // Checking if username exists or not
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (usernameExists) {
      return res.status(400).send({
        message: `Username ${body.username} already exists`,
      });
    }

    // Encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Creating User
    const user = await prisma.user.create({
      data: {
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        password: hashedPassword,
        username: body.username,
        dob: body.dob,
      },
    });

    const { password, ...rest } = user;

    res.status(200).send({
      message: "User Created Successfully!",
      user: rest,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
      error: error,
    });
  }
});

/**
 *
 *
 *
 *
 * * LOGIN ROUTE
 *
 *
 *
 *
 */
authRouter.get("/login", async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  const { error } = loginValidator(body);

  if (error) {
    return res.status(400).send({
      message: error.message,
    });
  }

  try {
    // Fetching User
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user === null) {
      return res.status(400).send({
        message: `User with email ${body.email} does not exists`,
      });
    }

    // Comparing Password
    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      return res.status(400).send({
        message: "Invalid Password",
      });
    }

    const { password, ...rest } = user;

    res.status(200).send({
      message: "Logged in Successfully!",
      user: rest,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
      error: error,
    });
  }
});

export default authRouter;
