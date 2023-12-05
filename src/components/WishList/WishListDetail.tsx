import { api } from "~/utils/api";
import { type FunctionComponent } from "react";
import { useSession } from "next-auth/react";
import { Header } from "../Header";
import { AddNewGift } from "../General/AddNewGift";
import React from "react";
import { GiftDetail } from "../Gift/GiftDetail";
import { TokenActions } from "../Token/TokenActions";
import { Gift, Token, WishList } from "@prisma/client";

type WishListDetailProps = {
  wishList: WishList & { gifts?: Gift[] } & { token?: Token };
};

export const WishListDetail: FunctionComponent<WishListDetailProps> = (
  props
) => {
  const { wishList } = props;
  const { data: sessionData } = useSession();

  const canAddAGift = sessionData?.user.id === wishList?.userId;

  return (
    <div className="text-white">
      <Header variant={1}>{wishList.name}</Header>
      <TokenActions wishList={wishList} />
      <span className="flex flex-row items-center gap-2">
        <Header variant={2}>Gifts</Header>
        {canAddAGift && <AddNewGift wishListId={wishList.id} />}
      </span>
      <div className="flex flex-col gap-2">
        {wishList.gifts?.map((wishListGift) => {
          return (
            <GiftDetail
              key={wishListGift.id}
              gift={wishListGift}
              wishListLength={wishList.gifts?.length ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
};
