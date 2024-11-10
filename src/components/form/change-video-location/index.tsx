/** @format */

import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoveVideos } from "@/hooks/useMoveVideos";
import React from "react";

type ChangeVideoLocationProps = {
  videoId: string;
  currentWorkspace?: string;
  currentFolder?: string;
  currentFolderName?: string;
};

const ChangeVideoLocation = ({
  videoId,
  currentWorkspace,
  currentFolder,
  currentFolderName,
}: ChangeVideoLocationProps) => {
  const {
    onSubmitForm,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkspace!);

  const folder = isFolders?.find((folder) => folder.id === currentFolder);
  const workspace = workspaces?.find(
    (workspace) => workspace.id === currentWorkspace
  );

  return (
    <form className="flex flex-col gap-y-5" onSubmit={onSubmitForm}>
      <div className="border-[1px] rounded-xl p-5">
        <h2 className="flex-xs mb-5 text-[#a4a4a4]">Current workspace</h2>
        {workspace && <p className="text-[#a4a4a4]">{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : "This video has no folder"}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="flex-xs  text-[#a4a4a4]">To New Location</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-[#a4a4a4] text-xs">Workspace</p>
          <select
            className="rounded-xl text-base bg-transparent"
            {...register("workspace_id")}>
            {workspaces.map((space) => {
              return (
                <option
                  key={space.id}
                  className="text-[#a4a4a4] "
                  value={space.id}>
                  {space.name}
                </option>
              );
            })}
          </select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-10 rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-xs">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                className="rounded-xl bg-transparent text-base"
                {...register("folder_id")}>
                {isFolders.map((folder, key) =>
                  key === 0 ? (
                    <option
                      className="text-[#a4a4a4]"
                      key={folder.id}
                      value={folder.id}>
                      {folder.name}
                    </option>
                  ) : (
                    <option
                      className="text-[#a4a4a4]"
                      key={folder.id}
                      value={folder.id}>
                      {folder.name}
                    </option>
                  )
                )}
              </select>
            ) : (
              <p className="text-[#a4a4a4] text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;