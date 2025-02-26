import { isServer, QueryCache, QueryClient } from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (err) => {
        let errorMessage: string;
        if (err instanceof HTTPException) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          errorMessage = "An unknown error occurred.";
        }
        // toast notify user, log as an example
        console.info(errorMessage);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
