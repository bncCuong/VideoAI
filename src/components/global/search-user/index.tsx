/** @format */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch";
import { User } from "lucide-react";
import React from "react";
import Loader from "../loader";
import { Spinner } from "../loader/spinner";
import { inviteMember } from "@/actions/user";

type Props = {
  workspaceId: string;
};

const SearchUser = ({ workspaceId }: Props) => {
  const { onSearchQuery, query, isFetching, onUsers } = useSearch(
    "get-users",
    "USERS"
  );

  const { mutate, isPending } = useMutationData(
    ["invite-member"],
    (data: { recieverId: string; email: string }) =>
      inviteMember(workspaceId, data.recieverId, data.email)
  );

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 outline-none focus:border-none"
        placeholder="Search for your users"
        type="text"
      />
      {isFetching ? (
        <div className=" relative rounded-[4px] border-t-2 border-b-2 border-t-neutral-800 border-b-neutral-800">
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
          <Skeleton className="w-full h-8 " />
        </div>
      ) : !onUsers ? (
        <p className="text-sm text-[#a4a4a4] text-center">No users found</p>
      ) : (
        <div>
          {onUsers.map((user) => {
            return (
              <div
                key={user.id}
                className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl">
                <Avatar>
                  <AvatarImage
                    src={user.image as string}
                    alt={user.email as string}
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold capitalize">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className=" text-xs text-[#b5b2b2] rounded-lg">
                    {user.subscription?.plan}
                  </p>
                </div>
                <div className="flex justify-end items-center flex-1">
                  <Button
                    variant="default"
                    className="w-5/12 font-bold flex items-center gap-2"
                    onClick={() =>
                      mutate({ recieverId: user.id, email: user.email })
                    }>
                    <Loader
                      state={isPending}
                      className="size-4 mb-1"
                      color="#000">
                      Invite
                    </Loader>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
