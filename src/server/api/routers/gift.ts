import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { repositionAdjacentItems } from "~/utils/list";

export const giftRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        wishListId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const wishListLength = await ctx.prisma.gift.count({
        where: { wishListId: input.wishListId },
      });
      const newGift = await ctx.prisma.gift.create({
        data: { ...input, userId: ctx.session.user.id, position: -1 },
      });

      await repositionAdjacentItems({
        ctx,
        gift: newGift,
        wishListLength,
        newGiftPosition: 1,
      });

      return await ctx.prisma.gift.update({
        where: { id: newGift.id },
        data: { position: 1 },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        giftId: z.string(),
        name: z.string(),
        link: z.string().url().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.gift.update({
        where: { id: input.giftId, userId: ctx.session.user.id },
        data: { name: input.name, link: input.link },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ giftId: z.string(), wishListId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const wishListLength = await ctx.prisma.gift.count({
        where: { wishListId: input.wishListId },
      });

      const gift = await ctx.prisma.gift.findUnique({
        where: { id: input.giftId },
      });

      if (!gift) throw new Error("No gift found");

      // Delete the gift to free up the position value
      await ctx.prisma.gift
        .delete({
          where: { id: input.giftId, userId: ctx.session.user.id },
        })
        .catch(() => {
          return new Error("You are not allowed to delete this gift");
        });

      // No re-positioning needed if at the end of the list
      if (gift.position === wishListLength) return;

      await repositionAdjacentItems({
        ctx,
        gift,
        newGiftPosition: wishListLength,
      });
    }),
  claim: publicProcedure
    .input(z.object({ giftId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.gift
        .update({
          where: {
            id: input.giftId,
            claimed: false,
          },
          data: {
            claimed: true,
            fromUserId: ctx?.session?.user.id || null,
          },
        })
        .catch((err) => {
          return new Error("This gift has been claimed already.");
        });
    }),
  move: protectedProcedure
    .input(z.object({ giftId: z.string(), position: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.position < 1)
        throw new Error("Position values need to be greater than 0");

      const gift = await ctx.prisma.gift.findUnique({
        where: { id: input.giftId },
      });

      if (!gift || typeof gift.position !== "number")
        throw new Error("No gift found");

      const wishListLength = await ctx.prisma.gift.count({
        where: { wishListId: gift.wishListId },
      });

      if (input.position > wishListLength)
        throw new Error("Position values cannot exceed the wish list size");

      // Put gift into temporary position
      await ctx.prisma.gift.update({
        where: { id: input.giftId },
        data: { position: -1 },
      });

      await repositionAdjacentItems({
        ctx,
        gift,
        newGiftPosition: input.position,
      });

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
