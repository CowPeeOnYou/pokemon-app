import { createReactQueryHooks } from "@trpc/react";
import { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "../pages/api/trpc/[trpc]";

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

export type inferQueryResponse<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;
