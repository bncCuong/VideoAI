/** @format */

import React from "react";

const WorkplacePlaceholder = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="flex items-center bg-[#545454] font-bold justify-center w-8 px-2 h-7 rounded-sm text-[#1d1d1d]">
      {children}
    </span>
  );
};

export default WorkplacePlaceholder;
