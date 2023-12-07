import { PlusIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";

type AddNewGiftProps = {
  wishListId: string;
};

export const AddNewGift = (props: AddNewGiftProps) => {
  const { wishListId } = props;

  const utils = api.useContext();
  const giftMutation = api.gift.create.useMutation({
    onSettled: () => {
      utils.wishList.getWishList.invalidate();
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
