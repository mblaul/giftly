import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
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

const WishListInputForm = () => {
  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const wishListMutation = api.wishList.create.useMutation({
    onSettled: async () => {
      await utils.wishList.getUserWishLists.invalidate();
    },
  });
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
    <div>
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
    </div>
  );
};

export default WishListInputForm;
