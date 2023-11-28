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
    // newPositions.set(listItemPosition, newListItemPosition);
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
    const moveLength = newListItemPosition - listItemPosition;
    const newPositions = new Map<number, number>();
    // newPositions.set(listItemPosition, newListItemPosition);
    for (
      let i = newListItemPosition;
      i > newListItemPosition - moveLength;
      i--
    ) {
      newPositions.set(i, i - 1);
    }
    return newPositions;
  }
}
