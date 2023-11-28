import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { recalculatePositions } from "~/utils/list";

export const giftRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        link: z.string(),
        wishListId: z.string(),
        position: z.number().gte(0),
      })
    )
    .mutation(({ ctx, input }) => {
      // TODO: Add wishListPosition logic
      return ctx.prisma.gift.create({
        data: { ...input, userId: ctx.session.user.id },
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
  move: protectedProcedure
    .input(z.object({ giftId: z.string(), position: z.number().gte(0) }))
    .mutation(async ({ ctx, input }) => {
      const gift = await ctx.prisma.gift.findUnique({
        where: { id: input.giftId },
      });

      if (!gift || typeof gift.position !== "number")
        throw new Error("No gift found");

      const direction = gift.position > input.position ? "down" : "up";

      const newPositions = recalculatePositions(gift.position, input.position);

      // Put gift into temporary position
      await ctx.prisma.gift.update({
        where: { id: input.giftId },
        data: { position: -1 },
      });

      // Loop over and update positions

      if (!newPositions) throw new Error("No position updates");
      for (const [oldPosition, newPosition] of newPositions.entries()) {
        await ctx.prisma.gift.update({
          where: {
            wishListId_position: {
              wishListId: gift.wishListId,
              position: oldPosition,
            },
          },
          data: { position: newPosition },
        });
      }

      return await ctx.prisma.gift.update({
        where: { id: input.giftId },
        data: { position: input.position },
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
