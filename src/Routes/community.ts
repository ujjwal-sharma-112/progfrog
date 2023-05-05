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
    // Checking if community already exists or not
    const communityExists = await prisma.community.findFirst({
      where: {
        c_name: body.c_name,
      },
    });

    if (communityExists) {
      return res.status(400).send({
        message: `Community with name ${body.c_name} already exists!`,
      });
    }

    // Creating Community
    const community = await prisma.community.create({
      data: {
        c_name: body.c_name,
        owner__id: body.owner__id,
      },
    });

    // Updating Community Member count and member id
    const updatedCommunity = await prisma.community.update({
      where: {
        id: community.id,
      },
      data: {
        members: {
          connect: {
            id: body.owner__id,
          },
        },
        membersCount: {
          increment: 1,
        },
      },
    });

    // Adding the created community to user owned Community
    await prisma.user.update({
      where: {
        id: body.owner__id,
      },
      data: {
        ownedCommunities: {
          connect: {
            id: community.id,
          },
        },
      },
    });

    const { owner__id, ...rest } = updatedCommunity;

    res.status(200).send({
      message: "Community created successfully!",
      community: rest,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
      error: error,
    });
  }
});

// Joining a community
communityRouter.post("/join", async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  // const { error } = joinCommunityValidator(body);

  // if (error) {
  //   return res.status(400).send({
  //     message: error.message,
  //   });
  // }

  try {
    // Check if user is already a member of the community
    const isMember = await prisma.community.findFirst({
      where: {
        id: body.c__id,
        members: {
          some: {
            id: body.u__id,
          },
        },
      },
    });

    if (isMember) {
      return res.status(400).send({
        message: "You are already a member of this community!",
      });
    }

    // Check if community exists
    const communityExists = await prisma.community.findFirst({
      where: {
        id: body.c__id,
      },
    });

    if (!communityExists) {
      return res.status(400).send({
        message: "Community does not exist!",
      });
    }

    // Join community
    const community = await prisma.community.update({
      where: {
        id: body.c__id,
      },
      data: {
        members: {
          connect: {
            id: body.u__id,
          },
        },
        membersCount: {
          increment: 1,
        },
      },
    });

    const { owner__id, ...rest } = community;

    res.status(200).send({
      message: "Joined community successfully!",
      community: rest,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
      error: error,
    });
  }
});

// Leaving a community
communityRouter.post("/leave", async (req: Request, res: Response) => {
  const body = req.body;

  // Body Validation
  // const { error } = leaveCommunityValidator(body);

  // if (error) {
  //   return res.status(400).send({
  //     message: error.message,
  //   });
  // }

  try {
    // Check if user is a member of the community
    const isMember = await prisma.community.findFirst({
      where: {
        id: body.c__id,
        members: {
          some: {
            id: body.u__id,
          },
        },
      },
    });

    if (!isMember) {
      return res.status(400).send({
        message: "You are not a member of this community!",
      });
    }

    // Check if community exists
    const communityExists = await prisma.community.findFirst({
      where: {
        id: body.c__id,
      },
    });

    if (!communityExists) {
      return res.status(400).send({
        message: "Community does not exist!",
      });
    }

    // Leave community
    const community = await prisma.community.update({
      where: {
        id: body.c__id,
      },
      data: {
        members: {
          disconnect: {
            id: body.u__id,
          },
        },
        membersCount: {
          decrement: 1,
        },
      },
    });

    const { owner__id, ...rest } = community;

    res.status(200).send({
      message: "Left community successfully!",
      community: rest,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong!",
      error: error,
    });
  }
});

export default communityRouter;
