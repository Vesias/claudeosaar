import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { userRouter } from "./routers/user"; // This will be created next
import superjson from 'superjson';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson, // Enable superjson for data serialization (handles Dates, Maps, Sets, etc.)
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
// export const protectedProcedure = t.procedure.use(isAuthedMiddleware); // Example for protected routes

export const appRouter = router({
  user: userRouter, // Mount the user router
  // Add other routers here
});

export type AppRouter = typeof appRouter;
