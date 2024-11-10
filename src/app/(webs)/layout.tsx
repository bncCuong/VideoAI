/** @format */

import React from "react";
import LandingPageNavbar from "./_components/navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col p-10 xl:px-0 container">
      <LandingPageNavbar />
      {children}
    </div>
  );
};

export default Layout;
