import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { WishListDetail } from "../WishList/WishListDetail";

export const PublicTokenRouter = () => {
  const router = useRouter();
  const tokenId =
    router.query.slug &&
    Array.isArray(router.query.slug) &&
    router.query.slug[0];

  const { data: wishList } = api.wishList.getPublicWishList.useQuery({
    tokenId: tokenId || "",
  });

  if (!wishList) return <div>Nope</div>;
  return <WishListDetail wishList={wishList} />;
};
