import { PlusIcon } from "@heroicons/react/24/outline";
import React, { FunctionComponent } from "react";
import { api } from "~/utils/api";

type AddNewGiftProps = {
  wishListId: string;
};

export const AddNewGift: FunctionComponent<AddNewGiftProps> = (props) => {
  const { wishListId } = props;

  const utils = api.useContext();
  const giftMutation = api.gift.create.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

  function addGift() {
    giftMutation.mutate({
      name: "Untitled Gift",
      wishListId,
    });
  }

  return (
    <div>
      <PlusIcon className="w-4 stroke-[3px]" onClick={addGift} />
    </div>
  );
};
