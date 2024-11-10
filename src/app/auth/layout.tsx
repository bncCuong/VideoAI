/** @format */

import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="container h-screen flex items-center justify-center ">
      {children}
    </div>
  );
};

export default Layout;
