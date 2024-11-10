/** @format */

import React from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

type Props = {
  state: boolean;
  className?: string;
  color?: string;
  children?: React.ReactNode;
};

const Loader = ({ state, className, color, children }: Props) => {
  return state ? (
    <div>
      <Spinner className={className} />
    </div>
  ) : (
    children
  );
};

export default Loader;