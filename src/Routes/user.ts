import { Router, Response, Request } from "express";
import prisma from "../../prisma/prisma";

const userRouter = Router();

userRouter.get("/get/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      message: "User id not provided",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        dob: true,
        ownedCommunities: true,
        joinedCommunities: true,
        posts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).send({
        message: `User with id ${id} not found`,
      });
    }

    return res.status(200).send({
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default userRouter;
