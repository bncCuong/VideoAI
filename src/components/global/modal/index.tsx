/** @format */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";

type Props = {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};
const Modal = ({ children, trigger, title, description, className }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
