/** @format */
"use client";
import CommentForm from "@/components/form/comment-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types/index.type";
import { Dot } from "lucide-react";
import React, { useState } from "react";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProps[];
  isReply: boolean;
  createdAt: Date;
};

const CommentCard = ({
  comment,
  author,
  videoId,
  commentId,
  reply,
  createdAt,
  isReply,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);
  return (
    <Card
      className={cn(
        isReply
          ? "bg-[#1d1d1d] pl-10 border-none"
          : "border-[1px] bg-[#1d1d1d] p-5",
        "flex items-center gap-x-3 relative my-2"
      )}>
      <Avatar className="size-8 absolute top-6 left-3.5">
        <AvatarImage src={author?.image} alt="author" />
      </Avatar>
      <div className="flex flex-col items-start gap-x-2 rounded-md p-2 w-full ml-10">
        <p className="flex items-center  capitalize text-sm text-[#efe7e7] font-bold">
          {`${author?.firstname} ${author?.lastname}`} <Dot scale={4} />
        </p>
        <p className="text-sm text-[#bdbdbd]"> {comment}</p>

        <div className="mt-2 w-full">
          <CommentForm
            close={() => setOnReply(false)}
            videoId={videoId}
            commentId={commentId}
            author={author.firstname + " " + author.lastname}></CommentForm>
        </div>
        {reply.length > 0 && (
          <div className="flex flex-col gap-y-10 mt-5">
            {reply.map((reply) => (
              <CommentCard
                isReply
                reply={[]}
                key={reply.id}
                {...reply}
                videoId={videoId}
                commentId={reply.comment}
                author={{
                  image: reply.User?.image!,
                  firstname: reply.User?.firstname!,
                  lastname: reply.User?.lastname!,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CommentCard;
