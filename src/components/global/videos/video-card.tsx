/** @format */

import React from "react";
import MenuVideoCard from "./video-card-menu";
import Loader from "../loader";
import ChangeVideoLocation from "@/components/form/change-video-location";
import CopyVideoLink from "./copy-link";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, User } from "lucide-react";
type VideoCardProps = {
  workspaceId: string;

  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  };
  id: string;
  processing: boolean;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
};
const VideoCard = (props: VideoCardProps) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );
  return (
    <Loader
      state={props.processing}
      className="bg-[#171717] flex justify-center items-center border-[1px] border-[#252525] rounded-xl">
      <div className="group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
        <div className="absolute top-3 right-3 z-50  gap-x-3 hidden  group-hover:flex">
          <MenuVideoCard
            videoId={props.id}
            currentWorkspace={props.workspaceId}
            currentFolder={props.Folder?.id}
            currentFolderName={props.Folder?.name}
          />
          <CopyVideoLink
            videoId={props.id}
            variant="ghost"
            className="p-0 h-5 hover:bg-transparent hover:scale-110 transition duration-150"
          />
        </div>
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full">
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-50 z-20">
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FONT_STREAM_URL}/${props.source}#t=1`}
              type="video/mp4"
            />
          </video>
          <div className="px-5 py-3 flex flex-col gap-2 z-20">
            <h2 className="text-sm font-semibold text-[#bdbdbd]">
              {props.title}
            </h2>
            <div className="flex gap-x-2 items-center">
              <Avatar className="size-8">
                <AvatarImage src={props.User.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="capitalize text-xs text-[#bdbdbd]">
                  {props.User.firstname} {props.User.lastname}
                </p>
                <p className="text-[#6d6d6d] text-xs">
                  {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <span className="flex gap-x-1 items-center">
                <Share2 fill="#9d9d9d" className="text-[#9d9d9d]" size={12} />
                <p className="text-xs text-[#9d9d9d] capitalize">
                  {props.User.firstname}'s Workspace
                </p>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
};

export default VideoCard;
