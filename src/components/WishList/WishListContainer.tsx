import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { api } from "~/utils/api";
import { WishListDetail } from "./WishListDetail";

type WishListQueryProps = {
  wishListId: string;
};

export const WishListQuery: FunctionComponent<WishListQueryProps> = (props) => {
  const { wishListId } = props;
  const { data: wishList } = api.wishList.getWishList.useQuery({ wishListId });

  if (!wishList) return <div>No wishlist found</div>;

  return <WishListDetail wishList={wishList} />;
};
