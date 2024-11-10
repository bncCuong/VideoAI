/** @format */

"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }
    const isUserWorkSpace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return {
      status: 200,
      data: { workspace: isUserWorkSpace },
    };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return {
      status: 403,
      data: { workspace: null },
    };
  }
};

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolder = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolder && isFolder.length > 0) return { status: 200, data: isFolder };

    return { status: 404, data: [] };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: [] };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = currentUser();
    if (!user) return { status: 404 };
    const videos = await client.video.findMany({
      where: {
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        source: true,
        createdAt: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (videos && videos.length > 0) return { status: 200, data: videos };
    return { status: 403, data: [] };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: [] };
  }
};

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) return { status: 200, data: workspaces };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: null };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };
    const authorized = await client.user.findUnique({
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

    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });
      if (workspace) return { status: 201, data: "Workspace created" };
    }
    return {
      status: 403,
      data: "You are not authorized to create a workspace",
    };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: null };
  }
};

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: { id: folderId },
      data: { name },
    });
    if (folder) return { status: 200, data: "Folder Renamed" };
    return { status: 400, data: "Folder not exist" };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: "Opps! something went wrong" };
  }
};

export const createFolders = async (workSpaceId: string) => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: { id: workSpaceId },
      data: {
        folders: {
          create: {
            name: "New Folder",
          },
        },
      },
    });

    if (isNewFolder) return { status: 200, data: "New folder created" };
    return { status: 400, data: "Folder not created" };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: "Opps! something went wrong" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: { id: folderId },
      select: {
        name: true,
        _count: {
          select: { videos: true },
        },
      },
    });
    if (folder) return { status: 200, data: folder };
    return { status: 404, data: null };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: null };
  }
};

export const moveVideoToFolder = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: { id: videoId },
      data: { folderId: folderId || null, workSpaceId },
    });
    if (location) return { status: 200, data: "Folder changed successfully" };
    return { status: 400, data: "Folder/Workspace can not changed" };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500, data: "Opps! something went wrong" };
  }
};

export const getVideoPreview = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const video = await client.video.findUnique({
      where: { id: videoId },
      select: {
        title: true,
        description: true,
        source: true,
        createdAt: true,
        processing: true,
        views: true,
        summery: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            clerkid: true,
            image: true,
            subscription: {
              select: { plan: true },
            },
            trial: true,
          },
        },
      },
    });
    if (video)
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
      };
    return { status: 404, data: null };
  } catch (err) {
    console.log("🔴 ERROR", err);
    return { status: 500, data: null };
  }
};

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summery: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
      };
    }

    return { status: 404 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};
