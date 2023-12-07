import { useSession } from "next-auth/react";
import { Header } from "../Header";
import { AddNewGift } from "../General/AddNewGift";
import { GiftDetail } from "../Gift/GiftDetail";
import { TokenActions } from "../Token/TokenActions";
import { WishListAsProp } from "~/types";
import { useEffect, useRef, useState } from "react";

type WishListDetailProps = {
  wishList: WishListAsProp;
};

export const WishListDetail = (props: WishListDetailProps) => {
  const { wishList } = props;
  const { data: sessionData } = useSession();
  const originalGiftIds = useRef(wishList.gifts?.map((gift) => gift.id));

  const canAddAGift = sessionData?.user.id === wishList?.userId;

  return (
    <div className="flex flex-col gap-3 text-white">
      <Header variant={1}>{wishList.name}</Header>
      {sessionData?.user && <TokenActions wishList={wishList} />}
      <span className="flex flex-row items-center gap-2">
        <Header variant={2}>Gifts</Header>
        {canAddAGift && <AddNewGift wishListId={wishList.id} />}
      </span>
      <div className="flex flex-col gap-2">
        {wishList.gifts?.map((gift, index) => {
          const isNewGift =
            index === 0 &&
            originalGiftIds.current &&
            !originalGiftIds.current.includes(gift.id);

          return (
            <GiftDetail
              mountInEditMode={isNewGift}
              key={gift.id}
              gift={gift}
              wishListLength={wishList.gifts?.length ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
};
