import type { Context } from "@/server/trpc/context";
import { transformer } from "@/server/trpc/transformer";
import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

// Avoid exporting the entire t-object since it's not very
// descriptive and can be confusing to newcomers used to t
// meaning translation in i18n libraries
const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.code === "BAD_REQUEST" && error.cause instanceof ZodError ? error.cause?.flatten() : null,
    },
  }),
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
