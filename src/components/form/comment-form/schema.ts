/** @format */

import { z } from "zod";

export const commentFormSchema = z.object({
  comment: z.string().min(1, { message: "Comment is not allowed to be empty" }),
});
