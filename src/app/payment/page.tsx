/** @format */

import { completeSubcription } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
type Props = {
  searchParams: {
    cancel?: boolean;
    session_id: string;
  };
};
const Payment = async ({ searchParams }: Props) => {
  const { cancel, session_id } = await searchParams;
  if (session_id) {
    const customer = await completeSubcription(session_id);
    if (customer.status === 200) {
      redirect("auth/callback");
    }
  }

  if (cancel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <h4 className="text-5xl font-bold">404</h4>
        <p className="text-xl text-center">Opps! Something went wrong!!!</p>
      </div>
    );
  }
};

export default Payment;
