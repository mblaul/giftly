import React from "react";
import { api } from "~/utils/api";
import Link from "next/link";
import { Header } from "../Header";
import WishListInputForm from "./WishListInputForm";

export const WishLists = () => {
  const { data: sharedWishLists } = api.wishList.getSharedWishLists.useQuery();
  const { data: wishLists } = api.wishList.getUserWishLists.useQuery();

  return (
    <div className="text-white">
      <WishListInputForm />
      <Header variant={1}>Wish Lists</Header>
      <div>
        <h2 className="my-2 text-lg">Your Wish Lists</h2>
        {wishLists &&
          Array.isArray(wishLists) &&
          wishLists.map((wishList) => {
            return (
              <Link key={wishList.id} href={`/wishLists/${wishList.id}`}>
                {wishList.name}
              </Link>
            );
          })}
      </div>
      <h2 className="my-2 text-lg">Wish Lists Shared With You</h2>
      {sharedWishLists &&
        Array.isArray(sharedWishLists) &&
        sharedWishLists.map((wishList) => {
          return (
            <Link key={wishList.id} href={`/wishLists/${wishList.id}`}>
              {wishList.name}
            </Link>
          );
        })}
    </div>
  );
};
