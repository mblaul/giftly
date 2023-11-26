import React from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { Header } from "./Header";

const wishListFormInputs = {
  name: {
    htmlInput: {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
  },
};

export const WishLists = () => {
  const { data: sharedWishLists } = api.wishList.getSharedWishLists.useQuery();
  const { data: wishLists } = api.wishList.getUserWishLists.useQuery();
  const { data: sessionData } = useSession();
  const wishListMutation = api.wishList.create.useMutation();
  const [wishListInput, setwishListInput] = React.useState({
    name: undefined,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (sessionData === null) return <div>Nope</div>;

  function updatewishListInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setwishListInput({ ...wishListInput, [name]: value });
  }

  function submitwishList(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sessionData === null) return;
    if (!wishListInput.name) return;

    setIsSubmitting(true);
    wishListMutation.mutate({
      name: wishListInput.name,
    });
    setIsSubmitting(false);
  }

  return (
    <div className="text-white">
      <form onSubmit={submitwishList}>
        <fieldset
          className="text-black"
          disabled={isSubmitting}
          name="wishListInput"
        >
          {Object.entries(wishListFormInputs).map(
            ([_inputName, { htmlInput }]) => {
              return (
                <div key={htmlInput.name}>
                  <label className="text-white" htmlFor={htmlInput.name}>
                    {htmlInput.label}
                  </label>
                  <input
                    name={htmlInput.name}
                    type={htmlInput.type}
                    required={htmlInput.required}
                    onChange={updatewishListInput}
                  ></input>
                </div>
              );
            }
          )}
        </fieldset>
        <button type="submit">Click</button>
      </form>
      <Header variant={1}>Wish Lists</Header>
      <div>
        <h2 className="my-2 text-lg">Your Wish Lists</h2>
        {wishLists &&
          Array.isArray(wishLists) &&
          wishLists.map((wishList) => {
            return (
              <Link key={wishList.id} href={`/wishLists/${wishList.id}`}>
                {wishList.name}
              </Link>
            );
          })}
      </div>
      <h2 className="my-2 text-lg">Wish Lists Shared With You</h2>
      {sharedWishLists &&
        Array.isArray(sharedWishLists) &&
        sharedWishLists.map((wishList) => {
          return (
            <Link key={wishList.id} href={`/wishLists/${wishList.id}`}>
              {wishList.name}
            </Link>
          );
        })}
    </div>
  );
};
