import { LinkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { WishListAsProp } from "~/types";
import { api } from "~/utils/api";

type TokenActionProps = {
  wishList: WishListAsProp;
};

export const TokenActions = (props: TokenActionProps) => {
  const { wishList } = props;
  const wishListMutation = api.token.createWishListToken.useMutation();

  function createWishListToken() {
    wishListMutation.mutate({
      wishListId: wishList.id,
    });
  }

  function copyLink() {
    if (!wishList?.token?.id) return;
    const link = `${window.location.origin}/public/wishLists/${wishList.token.id}`;
    navigator.clipboard.writeText(link);
  }

  return (
    <div>
      {wishList.token ? (
        <div
          className="inline-flex flex-row gap-2 rounded bg-white p-2 text-black"
          onClick={copyLink}
        >
          <span>Copy Public Link</span>
          <LinkIcon className="w-6" />
        </div>
      ) : (
        <PlusIcon className="w-6" onClick={createWishListToken} />
      )}
    </div>
  );
};
