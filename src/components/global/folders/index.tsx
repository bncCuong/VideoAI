/** @format */
"use client";
import FolderDuotone from "@/components/icons/folder-duotone";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React from "react";
import Folder from "./folder";
import { getWorkspaceFolders } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { useMutationDataState } from "@/hooks/useMutationData";
import Videos from "@/components/global/videos";
import { useDispatch } from "react-redux";
import { FOLDERS } from "@/redux/slices/folder";

export type FoldersProps = {
  status: number;
  data: ({
    _count: {
      videos: number;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    workSpaceId: string | null;
  })[];
};

type Props = {
  workspaceId: string;
};

const Folders = ({ workspaceId }: Props) => {
  const dispatch = useDispatch();
  const { data, isFetched } = useQueryData(["workspace-folders"], () =>
    getWorkspaceFolders(workspaceId)
  );

  const { status, data: foldersData } = data as FoldersProps;

  const { latestVariables } = useMutationDataState(["create-folder"]);

  if (isFetched && foldersData) {
    dispatch(FOLDERS({ folders: foldersData }));
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#bdbdbd] text-xl">Folders</h2>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <p className="text-[#bdbdbd]">See all</p>
          <ArrowRight color="#707070" />
        </div>
      </div>

      <section
        className={cn(
          status !== 200 && "justify-center",
          "flex items-center gap-4 overflow-x-auto w-full ml-5"
        )}>
        {status !== 200 ? (
          <p className="text-neutral-300">No folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={(latestVariables.variables as { name: string }).name}
                id={(latestVariables.variables as { id: string }).id}
                optimistics
              />
            )}
            {foldersData.map((folder) => {
              return (
                <Folder
                  name={folder.name}
                  id={folder.id}
                  key={folder.id}
                  count={folder._count.videos}
                />
              );
            })}
          </>
        )}
      </section>
      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="user-videos"
      />
    </div>
  );
};

export default Folders;
