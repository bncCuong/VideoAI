/** @format */

import { Spinner } from "@/components/global/loader/spinner";
import React from "react";

const AuthenLoading = () => {
  return (
    <div className="flex h-screen justify-center items-center ">
      <Spinner />
    </div>
  );
};

export default AuthenLoading;
