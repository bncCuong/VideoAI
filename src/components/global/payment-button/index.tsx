/** @format */
import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { useSubscription } from "@/hooks/useSubcription";
const PaymentButton = () => {
  const { onSubscribe, isProcessing } = useSubscription();
  return (
    <Button className="text-sm w-full mt-2" onClick={onSubscribe}>
      <Loader state={isProcessing}>Upgrade</Loader>
    </Button>
  );
};

export default PaymentButton;
