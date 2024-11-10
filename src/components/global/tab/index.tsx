/** @format */

import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import React from "react";
type Props = {
  defaultValue: string;
  triggers: string[];
  children: React.ReactNode;
};

const TabMenu = ({ defaultValue, triggers, children }: Props) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="flex justify-start bg-transparent">
        {triggers.map((trigger) => (
          <TabsTrigger
            key={trigger}
            value={trigger}
            className="capitalize text-base data-[state=active]:bg-[#2f2e2e] text-[#707070] hover:text-[#b6b6b6]">
            {trigger}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default TabMenu;
