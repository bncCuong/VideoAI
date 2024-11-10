/** @format */

import { createFolders } from "@/actions/workspace";
import { useMutationData } from "./useMutationData";

export const useCreateFolder = (workSpaceId: string) => {
  const { mutate } = useMutationData(
    ["create-folder"],
    () => createFolders(workSpaceId),
    "workspace-folders"
  );

  const onCreateNewFolder = () =>
    mutate({ name: "New Folder", id: "optimistic--id" });

  return { onCreateNewFolder };
};
