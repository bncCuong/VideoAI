/** @format */

import { TabsContent } from "@/components/ui/tabs";
import CommentForm from "@/components/form/comment-form";
import React from "react";
import CommentCard from "../comment-card";
import { useQueryData } from "@/hooks/useQueryData";
import { getVideosComments } from "@/actions/user";
import { VideoCommentProps } from "@/types/index.type";

type Props = {
  author: string;
  videoId: string;
};

const Activities = ({ author, videoId }: Props) => {
  const { data } = useQueryData(["video-comments"], () =>
    getVideosComments(videoId)
  );

  console.log(data, "data");
  const { data: comments } = data as VideoCommentProps;

  return (
    <TabsContent value="Activity">
      <CommentForm videoId={videoId} author={author} />
      {comments.map((comment) => {
        return (
          <CommentCard
            comment={comment.comment}
            key={comment.id}
            author={{
              image: comment.User?.image!,
              firstname: comment.User?.firstname!,
              lastname: comment.User?.lastname!,
            }}
            videoId={videoId}
            reply={comment.reply}
            commentId={comment.id}
            createdAt={comment.createdAt}
            isReply={comment.commentId ? true : false}
          />
        );
      })}
    </TabsContent>
  );
};

export default Activities;
