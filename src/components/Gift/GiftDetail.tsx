import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Gift } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { FunctionComponent } from "react";
import { api } from "~/utils/api";
import { EditItem } from "../General/EditItem";
import { Header } from "../Header";
import Link from "next/link";

type GiftDetailProps = {
  gift: Gift;
  wishListLength: number;
};

export const GiftDetail: FunctionComponent<GiftDetailProps> = (props) => {
  const { gift, wishListLength } = props;
  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const giftClaimMutation = api.gift.claim.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

  function claimGift() {
    giftClaimMutation.mutate({
      giftId: gift.id,
    });
  }
  const giftMoveMutation = api.gift.move.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

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
    <div className="flex min-h-[100px] items-center justify-center gap-2 overflow-hidden rounded bg-white p-4 text-black">
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
      <div className="basis-11/12">
        <EditItem gift={gift} />
      </div>
      <div>
        {sessionData?.user.id !== gift.userId && (
          <span className="cursor-pointer text-green-600" onClick={claimGift}>
            Claim
          </span>
        )}
      </div>
    </div>
  );
};
