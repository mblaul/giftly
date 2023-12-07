import { Gift } from "@prisma/client";

type RecalculatePositionsArgs = {
  listItemPosition: number;
  listLength?: number;
  newListItemPosition: number;
};

export function recalculatePositions(args: RecalculatePositionsArgs) {
  const { listItemPosition, newListItemPosition, listLength } = args;
  if (listItemPosition === newListItemPosition)
    throw new Error("No repositioning required");

  // New item has been added
  if (listItemPosition === -1) {
    if (listLength === undefined)
      throw new Error("List length is required when adding new option");
    const newPositions = new Map<number, number>();
    for (
      let i = newListItemPosition;
      i < newListItemPosition + listLength;
      i++
    ) {
      newPositions.set(i, i + 1);
    }

    return new Map([...newPositions].reverse());
    // return newPositions;
  }

  // Item has been moved up
  if (listItemPosition > newListItemPosition) {
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

  // Item has been moved down
  if (listItemPosition < newListItemPosition) {
    const newPositions = new Map<number, number>();
    for (let i = listItemPosition; i < newListItemPosition; i++) {
      newPositions.set(i + 1, i);
    }
    return newPositions;
  }
}

type RepositionAdjacentItemsArgs = {
  wishListLength?: number;
  ctx: any;
  gift: Gift;
  newGiftPosition: number;
};

export async function repositionAdjacentItems(
  args: RepositionAdjacentItemsArgs
) {
  const { wishListLength, ctx, gift, newGiftPosition } = args;
  const newPositions = recalculatePositions({
    listItemPosition: gift.position,
    newListItemPosition: newGiftPosition,
    listLength: wishListLength,
  });

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
