/** @format */
"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Loader from "../loader";
import FolderDuotone from "@/components/icons/folder-duotone";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import { renameFolders } from "@/actions/workspace";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  id: string;
  optimistics?: boolean;
  count?: number;
};

const Folder = ({ name, id, optimistics, count }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [onRename, setOnRename] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const folderCardRef = useRef<HTMLDivElement>(null);

  const handleFolderClick = () => {
    if (onRename) return;
    router.push(`${pathname}/folder/${id}`);
  };

  const Rename = () => setOnRename(true);
  const Renamed = () => setOnRename(false);

  const { mutate, isPending } = useMutationData(
    ["rename-folders"],
    (data: { name: string }) => renameFolders(id, data.name),
    "workspace-folders",
    Renamed
  );

  const { latestVariables } = useMutationDataState(["rename-folders"]);

  const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      mutate({ name: inputRef.current.value, id });
    } else {
      Renamed();
    }
  };

  const handleFolderNameDoubleClick = (
    e: React.MouseEvent<HTMLParagraphElement>
  ) => {
    e.stopPropagation();
    Rename();
  };
  return (
    <div
      ref={folderCardRef}
      onClick={handleFolderClick}
      className={cn(
        optimistics && "opacity-60",
        "flex hover:bg-neutral-800 cursor-pointer transition duration-200 items-center gap-2 justify-between min-w-[250px] py-6 px-4 rounded-lg border-[1px]"
      )}>
      <Loader state={isPending}>
        <div className="flex flex-col gap-[1px]">
          {onRename ? (
            <Input
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                updateFolderName(e)
              }
              autoFocus
              ref={inputRef}
              placeholder={name}
              className="px-2  text-base w-full  outline-none text-neutral-300 bg-transparent "
            />
          ) : (
            <p
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleFolderNameDoubleClick}
              className="text-neutral-300">
              {latestVariables &&
              latestVariables.status === "pending" &&
              (latestVariables.variables as { id: string; name: string }).id ===
                id
                ? (latestVariables.variables as { id: string; name: string })
                    .name
                : name}
            </p>
          )}

          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderDuotone />
    </div>
  );
};

export default Folder;
