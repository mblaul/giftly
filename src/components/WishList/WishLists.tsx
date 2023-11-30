import { WishList } from "@prisma/client";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

type WishListProps = {
  header: string;
  wishLists: WishList[];
  canAddAWishList?: boolean;
};

export const WishLists: FunctionComponent<WishListProps> = (props) => {
  const { canAddAWishList, header, wishLists } = props;

  return (
    <div>
      <span className="flex flex-row gap-2">
        <h2 className="my-2 text-lg">{header}</h2>
        {canAddAWishList && <PlusIcon className="w-4 stroke-[3px]" />}
      </span>
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
  );
};
