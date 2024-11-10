/** @format */
"use client";
import { getWorkspaces } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import React from "react";
import Modal from "../modal";
import { Button } from "@/components/ui/button";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "../../form/workspace-form";

const CreateWorkspace = () => {
  const { data } = useQueryData(["user-workspaces"], getWorkspaces);

  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "FREE" | "PRO";
      } | null;
    };
  };
  if (plan.subscription?.plan === "FREE") return <></>;
  if (plan.subscription?.plan === "PRO")
    return (
      <Modal
        title="Create a Workspace"
        trigger={
          <Button className="bg-[#1d1d1d] text-[#707070] flex items-center gap-2  h-12 rounded-2xl">
            <FolderPlusDuotine /> Create a Workspace
          </Button>
        }
        description="Workspace help you collaborate with team members. You are assigned a default personal workspace where you can share video in private with yourself.">
        <WorkspaceForm />
      </Modal>
    );
};

export default CreateWorkspace;
