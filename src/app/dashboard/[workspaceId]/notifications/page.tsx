/** @format */
"use client";
import { getNotifications } from "@/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryData } from "@/hooks/useQueryData";
import { notification } from "@/types/index.type";
import { User } from "lucide-react";
import React from "react";

const Notification = () => {
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: notification, status } = notifications as notification;
  if (status !== 200) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>No Notification</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {notification.notification?.map((noti) => {
        return (
          <div className="border-2 flex gap-x-3 items-center rounded-lg p-3">
            <Avatar>
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p>{noti.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Notification;
