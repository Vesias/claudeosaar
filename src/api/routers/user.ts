import { z } from "zod";
import { router, publicProcedure } from "../index"; // Use router and publicProcedure from ../index.ts

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(), // Made name optional to match schema
        email: z.string().email(),
        passwordHash: z.string().optional(), // Made passwordHash optional for this example
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: input.passwordHash || "placeholder_hash", // Provide a placeholder if not given
          // Add other fields as necessary
        },
      });
      return user;
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    return users;
  }),

  // Example: Get user by ID
  // getById: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ input, ctx }) => {
  //     const user = await ctx.prisma.user.findUnique({
  //       where: { id: input.id },
  //     });
  //     if (!user) {
  //       throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  //     }
  //     return user;
  //   }),
});

// Make sure to import TRPCError if you use it:
// import { TRPCError } from "@trpc/server";
