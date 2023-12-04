import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { type FunctionComponent } from "react";
import { useSession } from "next-auth/react";
import { Header } from "../Header";
import { AddNewGift } from "../General/AddNewGift";
import React from "react";
import { GiftDetail } from "../Gift/GiftDetail";

export const WishListRouter = () => {
  const router = useRouter();
  const wishListId =
    router.query.slug &&
    Array.isArray(router.query.slug) &&
    router.query.slug[0];

  if (typeof wishListId !== "string") return <div>No wishListId</div>;

  return <WishListDetail wishListId={wishListId} />;
};

type WishListDetailProps = {
  wishListId: string;
};

export const WishListDetail: FunctionComponent<WishListDetailProps> = (
  props
) => {
  const { wishListId } = props;
  const { data: sessionData } = useSession();
  const { data: wishList } = api.wishList.getWishList.useQuery({ wishListId });
  const { data: wishListGifts } = api.gift.getWishListGifts.useQuery({
    wishListId,
  });

  const canAddAGift = sessionData?.user.id === wishList?.userId;

  if (!wishList) return <div>No wishlist found</div>;

  return (
    <div className="text-white">
      <Header variant={1}>{wishList.name}</Header>
      <span className="flex flex-row items-center gap-2">
        <Header variant={2}>Gifts</Header>
        {canAddAGift && <AddNewGift wishListId={wishList.id} />}
      </span>
      <div className="flex flex-col gap-2">
        {wishListGifts?.map((wishListGift) => {
          return (
            <GiftDetail
              key={wishListGift.id}
              gift={wishListGift}
              wishListLength={wishListGifts.length}
            />
          );
        })}
      </div>
    </div>
  );
};
