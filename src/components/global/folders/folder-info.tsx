/** @format */
"use client";
import { getFolderInfo } from "@/actions/workspace";
import Videos from "@/components/global/videos";
import { useQueryData } from "@/hooks/useQueryData";
import { FolderInfoProps } from "@/types/index.type";
import React from "react";

const FolderInfo = ({ folderId }: { folderId: string }) => {
  const { data } = useQueryData(["folder-info"], () => getFolderInfo(folderId));

  const { data: folder } = data as FolderInfoProps;
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[#bdbdbd] text-2xl">{folder?.name}</h2>
    </div>
  );
};

export default FolderInfo;
