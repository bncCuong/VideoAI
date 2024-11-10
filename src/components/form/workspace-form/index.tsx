/** @format */

import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/useCreateWorkspace";
import React from "react";

const WorkspaceForm = () => {
  const { register, errors, onSubmitForm, isPending } = useCreateWorkspace();
  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-y-3">
      <FormGenerator
        name="name"
        register={register}
        placeholder="Workspace Name"
        inputType="input"
        label="Workspace Name"
        errors={errors}
        lines={1}
      />
      <Button
        className="text-sm w-full mt-2"
        type="submit"
        disabled={isPending}>
        <Loader color="blue" state={isPending} className="text-red-600">
          Create Workspace
        </Loader>
      </Button>
    </form>
  );
};

export default WorkspaceForm;
