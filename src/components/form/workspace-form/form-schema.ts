/** @format */

import z from "zod";

export const workspaceFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
