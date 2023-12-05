import { PlusIcon } from "@heroicons/react/24/outline";
import type { WishList, Token, Gift } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { api } from "~/utils/api";

type TokenActionProps = {
  wishList: WishList & { token?: Token } & { gifts?: Gift[] };
};

export const TokenActions: FunctionComponent<TokenActionProps> = (props) => {
  const { wishList } = props;
  const wishListMutation = api.token.createWishListToken.useMutation();

  function createWishListToken() {
    wishListMutation.mutate({
      wishListId: wishList.id,
    });
  }

  return (
    <div>
      {wishList.token ? (
        <Link href={`/public/wishLists/${wishList.token.id}`}>
          Link to public
        </Link>
      ) : (
        <div onClick={createWishListToken}>
          <PlusIcon className="w-5" />
        </div>
      )}
    </div>
  );
};
