import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/index"; // Changed to relative path

// Explicitly type `trpc` to see if it reveals more about AppRouter issues
export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();
