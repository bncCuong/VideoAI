/** @format */

import { Loader } from "lucide-react";
import React from "react";

const PaymentLoading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default PaymentLoading;
