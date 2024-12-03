"use client";

import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import type { FC } from "react";
import React from "react";

import { Card } from "../ui/card";
import { Icons } from "../Icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const onLogin = () => {
    signIn("google");
  };

  return (
    <div className={cn("flex flex-1 justify-center ", className)} {...props}>
      <div className="flex-1">
        <Card
          onClick={onLogin}
          className="flex w-full items-center justify-center gap-2 p-4"
        >
          <Icons.google className="size-6" />
          Google
        </Card>
      </div>
    </div>
  );
};

export default UserAuthForm;
