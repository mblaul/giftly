import {
  ArrowSmallDownIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/outline";
import { Gift } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { EditItem } from "../General/EditItem";
import { ClaimGift } from "./ClaimGift";

type GiftDetailProps = {
  gift: Gift;
  wishListLength: number;
};

export const GiftDetail = (props: GiftDetailProps) => {
  const { gift, wishListLength } = props;
  const utils = api.useContext();
  const { data: sessionData } = useSession();

  const giftMoveMutation = api.gift.move.useMutation({
    onSettled: () => {
      utils.wishList.getWishList.invalidate();
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
    <div className="flex min-h-[100px] items-center justify-center gap-2 rounded bg-white p-4 text-black">
      {sessionData && (
        <div>
          {gift.position > 1 && (
            <span onClick={() => moveGift("up")}>
              <ArrowSmallUpIcon className="w-6" />
            </span>
          )}
          {gift.position < wishListLength && (
            <span onClick={() => moveGift("down")}>
              <ArrowSmallDownIcon className="w-6" />
            </span>
          )}
        </div>
      )}
      <div>
        <EditItem gift={gift} />
      </div>
      <div>
        <ClaimGift gift={gift} />
      </div>
    </div>
  );
};
