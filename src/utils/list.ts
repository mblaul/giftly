import { Gift, Prisma } from "@prisma/client";

export function recalculatePositions(
  listItemPosition: number,
  newListItemPosition: number
) {
  if (listItemPosition === newListItemPosition)
    throw new Error("Why try that?");
  if (listItemPosition > newListItemPosition) {
    // Item has been moved up
    const moveLength = listItemPosition - newListItemPosition;
    const newPositions = new Map<number, number>();
    for (
      let i = newListItemPosition;
      i < newListItemPosition + moveLength;
      i++
    ) {
      newPositions.set(i, i + 1);
    }
    return newPositions;
  }
  if (listItemPosition < newListItemPosition) {
    // Item has been moved down
    const newPositions = new Map<number, number>();
    for (let i = listItemPosition; i < newListItemPosition; i++) {
      newPositions.set(i + 1, i);
    }
    return newPositions;
  }
}

export async function repositionAdjacentItems(
  ctx: any,
  gift: Gift,
  newGiftPosition: number
) {
  const newPositions = recalculatePositions(gift.position, newGiftPosition);

  if (!newPositions) return;

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
}
