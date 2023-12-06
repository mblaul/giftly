import { FunctionComponent } from "react";
import { api } from "~/utils/api";
import { WishListDetail } from "./WishListDetail";
import { Loading } from "../General/Loading";

type WishListQueryProps = {
  wishListId: string;
};

export const WishListQuery: FunctionComponent<WishListQueryProps> = (props) => {
  const { wishListId } = props;
  const { data: wishList, isLoading } = api.wishList.getWishList.useQuery({
    wishListId,
  });

  if (isLoading) return <Loading />;
  if (!wishList) return <div>No wishlist found</div>;

  return <WishListDetail wishList={wishList} />;
};
