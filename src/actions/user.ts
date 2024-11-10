/** @format */

"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transposter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const options = {
    // from: process.env.MAILER_USER,
    to,
    subject,
    text,
    html,
  };
  return { transposter, options };
};

export const onAuthenticationUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const existUser = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });
    if (existUser) {
      return { status: 200, user: existUser };
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: userEmail,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}s WorkSpace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }
    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });
    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications };

    return { status: 404, data: [] };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: [] };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 404 };
    }
    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    });
    if (users && users.length > 0) return { status: 200, data: users };
    return { status: 404, data: undefined };
  } catch (err) {
    console.log("🔴 ERROR", err);
    return { status: 500, data: undefined };
  }
};

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const payment = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (payment) return { status: 200, data: payment };
    return { status: 404 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const userData = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) {
      return { status: 200, data: userData.firstView };
    }
    return { status: 400, data: false };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const view = await client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    });

    if (view) {
      return { status: 200, data: "Setting updated" };
    }
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const profileIdAndImage = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage };
  } catch (error) {
    return { status: 400 };
  }
};

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });

    return { status: 200, data: comments };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      });
      if (reply) return { status: 200, data: "Reply posted" };
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    });

    if (newComment) return { status: 200, data: "New comment posted" };
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getVideosComments = async (id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: id }, { commentId: id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });

    if (comments) return { status: 200, data: comments };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const inviteMember = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const senderInfo = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workSpaceId: workspaceId,
            content: `You are invated to join ${workspace.name} Workspace, click acctep tio join!`,
          },
          select: {
            id: true,
          },
        });
        await client.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} ${senderInfo.lastname} to join ${workspace.name} Workspace`,
              },
            },
          },
        });
        if (invitation) {
          const { transposter, options } = await sendEmail(
            email,
            "You got an invitation",
            `You are invited to join ${workspace.name} Workspace, click acctep to join!`,
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000;color:#FFF; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          );

          transposter.sendMail(options, async (err, info) => {
            if (err) console.log("🔴 ERROR", err);
            else console.log("🟢 INFO", info);
          });
          return { status: 200, data: "Invitation sent" };
        }
        return { status: 400, data: "invitation failed" };
      }
      return { status: 404, data: "Workspace not found" };
    }
    return { status: 404, data: "Invitation failed" };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: "Opps! something went wrong" };
  }
};

export const accteptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            clerkid: true,
          },
        },
      },
    });

    if (user.id !== invitation?.reciever?.clerkid) return { status: 401 };
    const acctepInvitation = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    });

    const updateMember = client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation?.workSpaceId,
          },
        },
      },
    });

    const memberTransaction = await client.$transaction([
      acctepInvitation,
      updateMember,
    ]);

    if (memberTransaction) return { status: 200, data: "Invitation accepted" };
    return { status: 400, data: "Invitation failed" };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 401, data: "Opps! something went wrong" };
  }
};

export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const firstView = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    });

    if (!firstView?.firstView) return;
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        views: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    });
    if (video && video.views === 0) {
      await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          views: video.views + 1,
        },
      });
    }
    if (!video) return;
    const { transposter, options } = await sendEmail(
      video.User?.email as string,
      "You got a viewer",
      `Your video ${video.title} just got a viewer!`
    );
    transposter.sendMail(options, async (err, info) => {
      if (err) console.log("🔴 ERROR", err);
      else {
        const notification = await client.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} just viewed your video ${video.title}`,
              },
            },
          },
        });
        if (notification) return { status: 200, data: "Email sent" };
      }
    });
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string);
export const completeSubcription = async (sessionId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session) {
      const customer = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: "PRO",
              },
            },
          },
        },
      });
      if (customer) return { status: 200 };
    }
    return { status: 404 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};
