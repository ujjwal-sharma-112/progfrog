import { Router, Response, Request } from "express";
import prisma from "../../prisma/prisma";
import { verifyToken } from "../authToken";
import { postCreationValidator } from "../validator";

const postRouter = Router();

postRouter.post("/create", verifyToken, async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  const { error } = postCreationValidator(body);

  if (error) {
    return res.status(400).send({
      type: error.details[0].path[0],
      message: error.message,
    });
  }

  try {
    // Community Exists
    const communityExists = await prisma.community.findUnique({
      where: {
        id: body.c__id,
      },
    });

    if (communityExists == null) {
      return res.status(400).send({
        message: "This community does not exist!",
      });
    }

    // Fetching User
    const user = await prisma.user.findUnique({
      where: {
        id: body.u__id,
      },
    });

    if (user == null) {
      return res.status(400).send({
        message: "This user does not exist!",
      });
    }

    // Checking if user is part of community or not
    if (user.joinedCommunitiesIds.includes(body.c__id) == false) {
      return res.status(400).send({
        message: "User is not part of this community",
      });
    }

    // Creating Post
    const post = await prisma.post.create({
      data: {
        title: body.title,
        body: body.body,
        c__id: body.c__id,
        u__id: user.id,
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
