/** @format */

import { useEffect, useState } from "react";
import { useQueryData } from "./useQueryData";
import { searchUsers } from "@/actions/user";

export const useSearch = (key: string, type: "USERS") => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [onUsers, setOnUsers] = useState<
    | {
        id: string;
        subscription: {
          plan: "PRO" | "FREE";
        } | null;
        firstname: string | null;
        lastname: string | null;
        image: string | null;
        email: string | null;
      }[]
    | undefined
  >(undefined);

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    const debouceInputTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000);
    return () => clearTimeout(debouceInputTimer);
  }, [query]);

  const { refetch, isFetching } = useQueryData(
    [key, debouncedQuery],
    async ({ queryKey }) => {
      if (type === "USERS") {
        const user = await searchUsers(queryKey[1] as string);
        if (user.status === 200) {
          setOnUsers(user.data);
        }
      }
      return [];
    },
    false
  );

  useEffect(() => {
    debouncedQuery ? refetch() : setOnUsers(undefined);
    return () => {
      debouncedQuery;
    };
  }, [debouncedQuery]);

  return { onSearchQuery, query, isFetching, onUsers };
};
