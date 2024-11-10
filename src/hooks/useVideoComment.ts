/** @format */

import { commentFormSchema } from "@/components/form/comment-form/schema";
import { useQueryData } from "./useQueryData";
import { useZodForm } from "./useZodForm";
import { useMutationData } from "./useMutationData";
import { createCommentAndReply, getUserProfile } from "@/actions/user";

export const useVideoComment = (videoId: string, commentId?: string) => {
  const { data } = useQueryData(["user-profile"], getUserProfile);
  const { status, data: user } = data as {
    status: number;
    data: { id: string; image: string };
  };

  const { mutate, isPending } = useMutationData(
    ["new-comment"],
    (data: { comment: string }) =>
      createCommentAndReply(user.id, data.comment, videoId, commentId),
    "videos-comments",
    () => reset()
  );

  const { register, onSubmitForm, errors, reset } = useZodForm(
    commentFormSchema,
    mutate
  );

  return { register, onSubmitForm, errors, isPending };
};
