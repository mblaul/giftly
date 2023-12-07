import { GiftIcon } from "@heroicons/react/24/outline";
import { Gift } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

type ClaimGiftProps = {
  gift: Gift;
};

export const ClaimGift = (props: ClaimGiftProps) => {
  const { gift } = props;
  const utils = api.useContext();
  const { data: sessionData } = useSession();

  const giftClaimMutation = api.gift.claim.useMutation({
    onSettled: () => {
      utils.wishList.getPublicWishList.invalidate();
    },
  });

  function claimGift() {
    giftClaimMutation.mutate({
      giftId: gift.id,
    });
  }

  return (
    <div>
      {sessionData?.user.id !== gift.userId && (
        <GiftIcon className="w-6 text-green-600" onClick={claimGift} />
      )}
    </div>
  );
};
