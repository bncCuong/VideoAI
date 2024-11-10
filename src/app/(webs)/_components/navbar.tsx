/** @format */

import { Button } from "@/components/ui/button";
import { LogIn, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LandingPageNavbar = () => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Menu className="size-6" />
        <Image alt="logo" src="/ai-logo.svg" width={40} height={40} />
        Next AI
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link
          href="/"
          className="bg-[#7320DD] px-5 py-2 font-bold text-lg rounded-full hover:bg-[#7320DD]/80">
          Home
        </Link>
        <Link href="/">Pricing</Link>
        <Link href="/">Contact</Link>
      </div>
      <Link href="/auth/sign-in">
        <Button className="text-base gap-x-2 flex">
          {" "}
          <User fill="#000" /> Login
        </Button>
      </Link>
    </div>
  );
};

export default LandingPageNavbar;
