import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";

export const useDbUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await client.auth.getUserDetails.$get();
      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
