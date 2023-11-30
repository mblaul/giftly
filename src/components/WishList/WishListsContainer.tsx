import React from "react";
import { api } from "~/utils/api";
import { Header } from "../Header";
import { WishLists } from "./WishLists";

export const WishListContainer = () => {
  const { data: sharedWishLists } = api.wishList.getSharedWishLists.useQuery();
  const { data: userWishLists } = api.wishList.getUserWishLists.useQuery();

  return (
    <div>
      <Header variant={1}>Wish Lists</Header>
      <div>
        {userWishLists && (
          <WishLists
            canAddAWishList
            header="Your Wish Lists"
            wishLists={userWishLists}
          />
        )}
        {sharedWishLists && (
          <WishLists
            header="Wish Lists Shared With You"
            wishLists={sharedWishLists}
          />
        )}
      </div>
    </div>
  );
};
