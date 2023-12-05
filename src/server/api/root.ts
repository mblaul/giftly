import { createTRPCRouter } from "~/server/api/trpc";
import { giftRouter } from "./routers/gift";
import { tokenRouter } from "./routers/token";
import { wishListRouter } from "./routers/wishList";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  gift: giftRouter,
  token: tokenRouter,
  wishList: wishListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
