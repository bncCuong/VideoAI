/** @format */

import { onAuthenticationUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

const DashBoardPage = async () => {
  const auth = await onAuthenticationUser();
  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (auth.status === 400 || auth.status === 500 || auth.status === 403) {
    return redirect("/auth/sign-in");
  }
};

export default DashBoardPage;
