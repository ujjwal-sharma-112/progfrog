import { Router, Response, Request } from "express";
import prisma from "../../prisma/prisma";

const communityRouter = Router();

communityRouter.post("/create", async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  // const { error } = createCommunityValidator(body);

  // if (error) {
  //   return res.status(400).send({
  //     message: error.message,
  //   });
  // }

  try {
    const post = await prisma.community.create({
      data: {
        c_name: body.c_name,
        owner__id: body.owner__id,
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

export default communityRouter;
