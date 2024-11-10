/** @format */
"use client";
import { getVideoPreview } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { VideoProps } from "@/types/index.type";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CopyVideoLink from "../copy-link";
import { truncateString } from "@/lib/utils";
import RichLink from "../rich-link";
import { Download } from "lucide-react";
import TabMenu from "../../tab";
import AiTool from "../../tab/ai-tool";
import VideoTranscript from "../../tab/video-transcript";
import Activities from "../../tab/activity";
import { sendEmailForFirstView } from "@/actions/user";

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();
  const { data } = useQueryData(["preview-video"], () =>
    getVideoPreview(videoId)
  );

  const { status, data: video, author } = data as VideoProps;
  if (status !== 200) router.push("/dashboard");

  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(video?.createdAt).getTime()) / 86400000
  );

  const notifyFirstView = async () => await sendEmailForFirstView(videoId);
  useEffect(() => {
    if (video.views === 0) {
      notifyFirstView();
    }

    return () => {
      notifyFirstView();
    };
  }, []);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 p-10 lg:px-20 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {/* {author ? (<EditVideo />) : ""} */}
          </div>
          <span className="flex gap-x-3 mt-4">
            <p className="text-[#9d9d9] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          preload="metadata"
          controls
          className="w-full aspect-video opacity-50 rounded-xl">
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
          />
        </video>
        <div className="flex flex-col text-2xl gap-x-4 justify-center">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="text-[#bdbdbd] text-semibold">Description</p>
            {/* {author ? <EditVideo /> : <></>} */}
            <div className="flex justify-end gap-x-3">
              <CopyVideoLink
                variant="outline"
                className="rounded-full bg-transparent px-10"
                videoId={videoId}
              />
              <RichLink
                description={truncateString(video.description as string, 150)}
                id={videoId}
                source={video.source}
                title={video.title as string}
              />
              <Download className="text-[#4d4c4c] hover:text-white cursor-pointer size-7" />
            </div>
          </div>
          <p className="text-[#9d9d9d] text-lg text-medium mt-4">
            {video.description}
          </p>
        </div>
      </div>
      <div className="mt-5 w-full xl:w-[200%]">
        <TabMenu
          defaultValue="Ai tools"
          triggers={["Ai tools", "Transcript", "Activity"]}>
          <AiTool
            plan={video.User?.subscription?.plan as "FREE" | "PRO"}
            trial={video.User?.trial as boolean}
            videoId={videoId}
          />
          <VideoTranscript transcript={video.description as string} />
          <Activities
            author={video.User?.firstname as string}
            videoId={videoId}
          />
        </TabMenu>
      </div>
    </div>
  );
};

export default VideoPreview;
