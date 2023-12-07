import { Gift, Token, WishList } from "@prisma/client";

export type OptionalAssociation<AssociationType> =
  | null
  | undefined
  | AssociationType;

export type WishListAsProp = WishList & {
  gifts?: OptionalAssociation<Gift[]>;
} & {
  token?: OptionalAssociation<Token>;
};
