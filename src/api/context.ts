import { PrismaClient } from "@prisma/client";
// import { inferAsyncReturnType } from "@trpc/server"; // Not used in this basic setup
// import * as trpcNext from "@trpc/server/adapters/next"; // Not used for non-Next.js API routes directly here

const prisma = new PrismaClient();

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext() {
  // In a real app, you'd get session information here
  // For now, just return prisma
  return {
    prisma,
    // session: null, // Example: await getSession(),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
