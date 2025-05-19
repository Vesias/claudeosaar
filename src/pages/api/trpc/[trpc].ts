import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/api/index";
import { createContext } from "@/api/context";

// export API handler
// @see https://trpc.io/docs/v11/server/adapters/nextjs
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});
