/** @format */

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type SidebarItemProps = {
  title: string;
  href: string;
  icon: React.ReactNode;
  notifications?: number;
  selected: boolean;
};
const SidebarItem = ({
  title,
  href,
  icon,
  notifications,
  selected,
}: SidebarItemProps) => {
  return (
    <li className="cursor-pointer my-1 ">
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between group rounded-lg hover:bg-[#1d1d1d] w-full",
          selected ? "bg-[#1d1d1d]" : ""
        )}>
        <div className="cursor-pointer p-1 flex items-center transition-all gap-2">
          {icon}{" "}
          <span
            className={cn(
              "font-medium group-hover:text-[#9d9d9d] transition-all truncate w-32 ",
              selected ? "text-[#9d9d9d]" : "text-[#545454]"
            )}>
            {title}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
