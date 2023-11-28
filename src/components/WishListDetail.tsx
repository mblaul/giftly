import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { GiftInputForm } from "./GiftInputForm";
import { type FunctionComponent } from "react";
import { type Gift } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Header } from "./Header";

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

  const giftMoveMutation = api.gift.move.useMutation();

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

  function moveGift(direction: "up" | "down") {
    let newPosition = 0;
    if (direction === "up") newPosition = gift.position - 1;
    if (direction === "down") newPosition = gift.position + 1;

    giftMoveMutation.mutate({
      giftId: gift.id,
      position: newPosition,
    });
  }

  return (
    <div>
      {gift.position} - {gift.name} - {gift.link}
      {sessionData?.user.id && (
        <>
          <span> - </span>
          {sessionData.user.id === gift.userId && (
            <>
              <span onClick={() => moveGift("up")}>Up</span>
              <span
                className="cursor-pointer text-red-600"
                onClick={deleteGift}
              >
                Delete
              </span>
            </>
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
      <Header variant={1}>{wishList.name}</Header>
      {sessionData && sessionData.user.id === wishList.userId && (
        <GiftInputForm
          wishList={wishList}
          wishListLength={wishListGifts?.length ?? 0}
        />
      )}
      {wishListGifts?.map((wishListGift) => {
        return <GiftDetail key={wishListGift.id} gift={wishListGift} />;
      })}
    </div>
  );
};
