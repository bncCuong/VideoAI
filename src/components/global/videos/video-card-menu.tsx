/** @format */

import React from "react";
import Modal from "@/components/global/modal";
import { Move } from "lucide-react";
import ChangeVideoLocation from "@/components/form/change-video-location";

type MenuVideoCardProps = {
  videoId: string;
  currentWorkspace?: string;
  currentFolder?: string;
  currentFolderName?: string;
};

const MenuVideoCard = ({
  videoId,
  currentWorkspace,
  currentFolder,
  currentFolderName,
}: MenuVideoCardProps) => {
  return (
    <Modal
      className="flex items-center cursor-pointer gap-x-2"
      title="Move to new Workspace/Folder"
      description="This action cannot be undone. This will permanetly delete your account and remove your data from our severs"
      trigger={
        <Move
          size={20}
          fill="#a4a4a4"
          className="text-[#a4a4a4] hover:scale-110 transition duration-150"
        />
      }>
      <ChangeVideoLocation
        videoId={videoId}
        currentWorkspace={currentWorkspace}
        currentFolder={currentFolder}
        currentFolderName={currentFolderName}
      />
    </Modal>
  );
};

export default MenuVideoCard;
