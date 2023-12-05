import { useRouter } from "next/router";
import { WishListQuery } from "./WishListContainer";

export const PrivateWishListRouter = () => {
  const router = useRouter();
  const wishListId =
    router.query.slug &&
    Array.isArray(router.query.slug) &&
    router.query.slug[0];

  if (typeof wishListId !== "string") return <div>No wishListId</div>;

  return <WishListQuery wishListId={wishListId} />;
};
