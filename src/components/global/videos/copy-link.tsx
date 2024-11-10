/** @format */
"use client";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type CopyVideoLinkProps = {
  videoId: string;
  className: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
};

const CopyVideoLink = ({
  videoId,
  className,
  variant = "default",
}: CopyVideoLinkProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
    );

    return toast("Copied to clipboard", {
      description: "Link successfully copied",
    });
  };
  return (
    <Button variant={variant} className={className} onClick={handleCopyLink}>
      <Link scale={20} className="text-[#a4a4a4]" />
    </Button>
  );
};

export default CopyVideoLink;
