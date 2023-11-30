import { WishList } from "@prisma/client";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Header } from "../Header";

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
        <Header variant={2}>{header}</Header>
        {canAddAWishList && <PlusIcon className="w-4 stroke-[3px]" />}
      </span>
      <div className="flex flex-col gap-1">
        {wishLists &&
          Array.isArray(wishLists) &&
          wishLists.map((wishList) => {
            return (
              <Link
                key={wishList.id}
                href={`/wishLists/${wishList.id}`}
                className="bg-white bg-opacity-80 p-2 text-[#15162c]"
              >
                {wishList.name}
              </Link>
            );
          })}
      </div>
    </div>
  );
};
