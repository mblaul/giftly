import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { GiftInputForm } from "./GiftInputForm";
import { type FunctionComponent } from "react";
import { type Gift } from "@prisma/client";
import { useSession } from "next-auth/react";

type GiftDetailProps = {
  gift: Gift;
};
const GiftDetail: FunctionComponent<GiftDetailProps> = (props) => {
  const { gift } = props;
  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const giftDeleteMutation = api.gift.delete.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

  const giftClaimMutation = api.gift.claim.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

  function deleteGift() {
    giftDeleteMutation.mutate({
      giftId: gift.id,
    });
  }

  function claimGift() {
    giftClaimMutation.mutate({
      giftId: gift.id,
    });
  }

  return (
    <div>
      {gift.name} - {gift.link}
      {sessionData?.user.id && (
        <>
          <span> - </span>
          {sessionData.user.id === gift.userId && (
            <span className="cursor-pointer text-red-600" onClick={deleteGift}>
              Delete
            </span>
          )}
          {sessionData.user.id !== gift.userId && (
            <span className="cursor-pointer text-green-600" onClick={claimGift}>
              Claim
            </span>
          )}
        </>
      )}
    </div>
  );
};

export const WishListDetail = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const wishListId =
    router.query.slug &&
    Array.isArray(router.query.slug) &&
    router.query.slug[0];

  if (typeof wishListId !== "string") return <div>Nope</div>;

  const { data: wishList } = api.wishList.getWishList.useQuery({ wishListId });
  const { data: wishListGifts } = api.gift.getWishListGifts.useQuery({
    wishListId,
  });

  if (!wishList) return <div>Nope</div>;

  return (
    <div className="text-white">
      <h1>{wishList.name}</h1>
      {sessionData && sessionData.user.id === wishList.userId && (
        <GiftInputForm wishList={wishList} />
      )}
      {wishListGifts?.map((wishListGift) => {
        return <GiftDetail key={wishListGift.id} gift={wishListGift} />;
      })}
    </div>
  );
};
