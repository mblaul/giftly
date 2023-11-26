import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const giftRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        link: z.string().nullable(),
        wishListId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // TODO: Add wishListPosition logic
      return ctx.prisma.gift.create({
        data: { ...input, wishListPosition: 0, userId: ctx.session.user.id },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ giftId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.gift
        .delete({
          where: { id: input.giftId, userId: ctx.session.user.id },
        })
        .catch((err) => {
          return new Error("You are not allowed to delete this gift");
        });
    }),
  claim: protectedProcedure
    .input(z.object({ giftId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.gift
        .update({
          where: {
            id: input.giftId,
            wishList: {
              sharedUsers: { some: { sharedUserId: ctx.session.user.id } },
            },
          },
          data: {
            fromUserId: ctx.session.user.id,
          },
        })
        .catch((err) => {
          return new Error("You are not allowed to claim this gift");
        });
    }),
  getUserGifts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.gift.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  getWishListGifts: protectedProcedure
    .input(z.object({ wishListId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.gift.findMany({
        where: { wishListId: input.wishListId },
      });
    }),
});
