import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { GiftInputForm } from "./GiftInputForm";
import { type FunctionComponent } from "react";
import { type Gift } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Header } from "../Header";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ArrowSmallUpIcon } from "@heroicons/react/24/outline";
import { ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Dialog } from "../General/Dialog";
import { AddNewGift } from "../General/AddNewGift";

type GiftDetailProps = {
  gift: Gift;
  wishListLength: number;
};
const GiftDetail: FunctionComponent<GiftDetailProps> = (props) => {
  const { gift, wishListLength } = props;
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

  const giftMoveMutation = api.gift.move.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

  function deleteGift() {
    giftDeleteMutation.mutate({
      giftId: gift.id,
      wishListId: gift.wishListId,
    });
  }

  function claimGift() {
    giftClaimMutation.mutate({
      giftId: gift.id,
    });
  }

  function moveGift(direction: "up" | "down") {
    let newPosition = 1;
    if (direction === "up") newPosition = gift.position - 1;
    if (direction === "down") newPosition = gift.position + 1;

    giftMoveMutation.mutate({
      giftId: gift.id,
      position: newPosition,
    });
  }

  return (
    <div className="flex min-h-[100px] items-center justify-center gap-2 overflow-hidden rounded bg-white bg-opacity-80 p-4 text-black">
      <div className="flex basis-1/12 flex-col">
        {gift.position > 1 && (
          <span onClick={() => moveGift("up")}>
            <ArrowSmallUpIcon className="w-5" />
          </span>
        )}
        {gift.position < wishListLength && (
          <span onClick={() => moveGift("down")}>
            <ArrowSmallDownIcon className="w-5" />
          </span>
        )}
      </div>
      <div className="flex flex-grow basis-10/12 flex-col overflow-hidden">
        <span className="self-start">
          <Header variant={3}>{gift.name}</Header>
        </span>
        {gift.link && (
          <Link
            className="truncate text-blue-700 underline"
            target="_blank"
            href={gift.link}
          >
            {gift.link}
          </Link>
        )}
      </div>
      {sessionData?.user.id && (
        <div className="basis-1/12">
          {sessionData.user.id === gift.userId && (
            <div className="flex flex-row items-center">
              <div className="cursor-pointer text-red-600" onClick={deleteGift}>
                <TrashIcon className="w-5" />
              </div>
            </div>
          )}
          {sessionData.user.id !== gift.userId && (
            <span className="cursor-pointer text-green-600" onClick={claimGift}>
              Claim
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const WishListRouter = () => {
  const router = useRouter();
  const wishListId =
    router.query.slug &&
    Array.isArray(router.query.slug) &&
    router.query.slug[0];

  if (typeof wishListId !== "string") return <div>No wishListId</div>;

  return <WishListDetail wishListId={wishListId} />;
};

type WishListDetailProps = {
  wishListId: string;
};

export const WishListDetail: FunctionComponent<WishListDetailProps> = (
  props
) => {
  const { wishListId } = props;
  const { data: sessionData } = useSession();
  const { data: wishList } = api.wishList.getWishList.useQuery({ wishListId });
  const { data: wishListGifts } = api.gift.getWishListGifts.useQuery({
    wishListId,
  });

  const canAddAGift = sessionData?.user.id === wishList?.userId;

  if (!wishList) return <div>No wishlist found</div>;

  return (
    <div className="text-white">
      <Header variant={1}>{wishList.name}</Header>
      <span className="flex flex-row items-center gap-2">
        <Header variant={2}>Gifts</Header>
        {canAddAGift && <AddNewGift wishListId={wishList.id} />}
      </span>
      <div className="flex flex-col gap-2">
        {wishListGifts?.map((wishListGift) => {
          return (
            <GiftDetail
              key={wishListGift.id}
              gift={wishListGift}
              wishListLength={wishListGifts.length}
            />
          );
        })}
      </div>
    </div>
  );
};
