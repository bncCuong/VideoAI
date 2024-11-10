/** @format */
"use client";
import { getAllUserVideos } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { videoDataProps } from "@/types/index.type";
import React from "react";
import { cn } from "@/lib/utils";
import VideoCard from "./video-card";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";

type Props = {
  folderId: string;
  videosKey: string;
  workspaceId: string;
};

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
  const { data: videoData } = useQueryData([videosKey], () =>
    getAllUserVideos(folderId)
  );

  const { status: videoStatus, data: videos } = videoData as videoDataProps;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#bdbdbd] text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          videoStatus !== 200
            ? "p-5"
            : "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
          "ml-5"
        )}>
        {videoStatus === 200 ? (
          videos.map((video) => (
            <VideoCard key={video.id} workspaceId={workspaceId} {...video} />
          ))
        ) : (
          <p className="text-[#bdbdbd] text-center ml-12">
            No videos in workspace
          </p>
        )}
      </section>
    </div>
  );
};

export default Videos;
