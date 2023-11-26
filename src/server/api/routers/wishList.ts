import { CssSyntaxError } from "postcss";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const wishListRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.wishList.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
  getWishList: protectedProcedure
    .input(z.object({ wishListId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.wishList.findUnique({
        where: { id: input.wishListId },
      });
    }),
  getUserWishLists: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wishList.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  getSharedWishLists: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.wishList.findMany({
      where: { sharedUsers: { some: { sharedUserId: ctx.session.user.id } } },
    });
  }),
});
