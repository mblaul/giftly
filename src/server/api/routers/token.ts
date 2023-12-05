import { CssSyntaxError } from "postcss";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tokenRouter = createTRPCRouter({
  createWishListToken: protectedProcedure
    .input(z.object({ wishListId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const wishList = await ctx.prisma.wishList.findUnique({
        where: { id: input.wishListId, userId: ctx.session.user.id },
      });

      if (!wishList) throw new Error("No wishlist found");

      return await ctx.prisma.token.create({
        data: { ...input },
      });
    }),
});
