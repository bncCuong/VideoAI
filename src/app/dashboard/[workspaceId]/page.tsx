/** @format */

import CreateFolders from "@/components/global/create-folders";
import CreateWorkspace from "@/components/global/create-workspace";
import Folders from "@/components/global/folders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type Props = {
  params: { workspaceId: string };
};
const DashboardWorkspacePage = async ({ params }: Props) => {
  const { workspaceId } = await params;
  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              value="videos"
              className="p-2 px-6 rounded-full data-[state=active]:bg-[#424242]">
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="p-2 px-6 rounded-full data-[state=active]:bg-[#424242]">
              Archive
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-x-3">
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>

        <section className="py-9">
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
          </TabsContent>
          <TabsContent value="archive">Archive</TabsContent>
        </section>
      </Tabs>
    </div>
  );
};

export default DashboardWorkspacePage;
