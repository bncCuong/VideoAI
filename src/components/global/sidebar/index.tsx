/** @format */
"use client";

// React và Next.js core
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Redux
import { useDispatch } from "react-redux";
import { WORKSPACES } from "@/redux/slices/workspace";

// Hooks
import { useQueryData } from "@/hooks/useQueryData";

// Actions
import { getWorkspaces } from "@/actions/workspace";
import { getNotifications } from "@/actions/user";

// Types
import { NotificationProps, WorkSpaceProps } from "@/types/index.type";

// Constants
import { MENU_ITEMS } from "@/constant";

// Icons
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { ChevronLeft, ChevronsLeft, Menu, MoveLeft } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Custom Components
import GlobalCards from "../global-cards";
import InforBar from "../info-bar";
import Loader from "../loader";
import Modal from "../modal/index";
import SearchUser from "../search-user";
import SidebarItem from "./sidebar-item";
import WorkplacePlaceholder from "./workplace-placehoder";
import PaymentButton from "../payment-button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  activeWorkspaceId: string;
}

const SideBar = ({ activeWorkspaceId }: Props) => {
  const [overlay, setOverlay] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleWorkspaceChange = (value: string) => {
    setOverlay(true);
    router.push(`/dashboard/${value}`);
  };
  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkspaces);
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: workspaces } = data as WorkSpaceProps;
  const { data: count } = notifications as NotificationProps;

  const currentWorkspace = workspaces?.workspace.find(
    (s) => s.id === activeWorkspaceId
  );

  const menuItems = MENU_ITEMS(activeWorkspaceId);

  if (isFetched && workspaces) {
    dispatch(WORKSPACES({ workspaces: workspaces.workspace }));
  }

  const SidebarSection = (
    <div className="bg-[#111111] flex-none relative p-4  h-full w-[250px] flex flex-col gap-4 items-center overlow-hidden z-50">
      {overlay && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
          <Loader state={overlay} className="size-10 " />
        </div>
      )}
      <div className=" bg-[#111111] p-4 gap-2 justify-center flex items-center mb-4 absolute top-0 left-0 right-0">
        <Image src={"/ai-logo.svg"} alt="logo" width={40} height={40} />
        <p className="text-white text-lg font-semibold">AI Studio</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={handleWorkspaceChange}>
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue
            placeholder="Select Workspace"
            className="placeholder:text-neutral-400"
          />
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator className="my-2" />
            {workspaces?.workspace.map((workspace) => {
              return (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              );
            })}

            {workspaces?.members.length > 0 &&
              workspaces?.members.map((workspace) => {
                return (
                  workspace.WorkSpace && (
                    <SelectItem
                      key={workspace.WorkSpace.id}
                      value={workspace.WorkSpace.id}>
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  )
                );
              })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === "PUBLIC" &&
        workspaces.subscription?.plan === "PRO" && (
          <Modal
            title="Invite to Workspace"
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                <PlusCircledIcon className="size-4 text-neutral-800/90 fill-neutral-500" />
                <span className="text-neutral-400 font-semibold text-xs">
                  Invite to Workspace
                </span>
              </span>
            }
            description="Invite a user to your workspace">
            <SearchUser workspaceId={activeWorkspaceId} />
          </Modal>
        )}

      <div className="w-full flex justify-between items-center">
        <p className="mt-4 text-[#9d9d9d] font-bold w-full">Menu</p>
        {/* TODO: Add collapse sidebar */}
        <ChevronsLeft
          className="mt-3 text-[#9d9d9d] cursor-pointer"
          onClick={() => {}}
        />
      </div>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => {
            return (
              <SidebarItem
                href={item.href}
                icon={item.icon}
                selected={pathname === item.href}
                title={item.title}
                key={item.title}
                notifications={
                  (item.title === "Notifications" &&
                    count?._count &&
                    count?._count.notifications) ||
                  0
                }
              />
            );
          })}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="mt-4 text-[#9d9d9d] font-bold w-full">Workspace</p>
      {workspaces.workspace.length === 1 && workspaces.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspaces.subscription?.plan === "FREE"
              ? "Upgrade to create workspace"
              : "No workspace"}
          </p>
        </div>
      )}
      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspaces.workspace.length > 0 &&
            workspaces.workspace.map((item) => {
              return (
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    title={item.name}
                    selected={pathname === `/dashboard/${item.id}`}
                    key={item.id}
                    notifications={0}
                    icon={
                      <WorkplacePlaceholder children={item.name.charAt(0)} />
                    }
                  />
                )
              );
            })}
          {workspaces.members.length > 0 &&
            workspaces.members.map((item) => {
              return (
                <SidebarItem
                  href={`/dashboard/${item.WorkSpace.id}`}
                  title={item.WorkSpace.name}
                  selected={pathname === `/dashboard/${item.WorkSpace.id}`}
                  key={item.WorkSpace.id}
                  notifications={0}
                  icon={
                    <WorkplacePlaceholder
                      children={item.WorkSpace.name.charAt(0)}
                    />
                  }
                />
              );
            })}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      {workspaces.subscription?.plan === "FREE" && (
        <GlobalCards
          title="Upgrage to Pro"
          description="Unlocks AI futures like trancription, AI summary, and more"
          footer={<PaymentButton />}
        />
      )}
    </div>
  );

  return (
    <div className="z-50 ">
      <InforBar />
      <div className="md:hidden fixed my-4 z-50">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="p-0 w-fit h-full overflow-y-auto">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default SideBar;
