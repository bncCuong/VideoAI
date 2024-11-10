/** @format */

import { createWorkspace } from "@/actions/workspace";
import { useMutationData } from "./useMutationData";
import { useZodForm } from "./useZodForm";
import { workspaceFormSchema } from "@/components/form/workspace-form/form-schema";

export const useCreateWorkspace = () => {
  const { mutate, isPending } = useMutationData(
    ["create-workspace"],
    (data: { name: string }) => createWorkspace(data.name),
    "user-workspaces"
  );
  const { register, errors, onSubmitForm } = useZodForm(
    workspaceFormSchema,
    mutate
  );

  return { register, errors, onSubmitForm, isPending };
};
