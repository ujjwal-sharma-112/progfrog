import { Router, Response, Request } from "express";
import prisma from "../../prisma/prisma";

const postRouter = Router();

postRouter.post("/create", async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  // const { error } = postCreationValidator(body);

  // if (error) {
  //   return res.status(400).send({
  //     message: error.message,
  //   });
  // }

  try {
    // TODO: Check community
    // TODO: User can only post in the community he/she is member of

    const post = await prisma.post.create({
      data: {
        title: body.title,
        body: body.body,
        c__id: body.c__id,
        u__id: body.u__id,
      },
    });

    res.status(200).send({
      message: "Post created successfully!",
      post: post,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
      error: error,
    });
  }
});

export default postRouter;
