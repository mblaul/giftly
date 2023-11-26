import React, { FunctionComponent } from "react";
import { api } from "~/utils/api";
import { WishList } from "@prisma/client";
import { undefined } from "zod";

const giftFormInputs = {
  name: {
    htmlInput: {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
  },
  link: {
    htmlInput: {
      name: "link",
      label: "Link",
      type: "text",
      required: false,
    },
  },
};

type GiftInputFormProps = {
  wishList: WishList;
};

type GiftInput = {
  name: string;
  link?: string;
  wishListId?: string;
};

export const GiftInputForm: FunctionComponent<GiftInputFormProps> = (props) => {
  const { wishList } = props;

  const utils = api.useContext();
  const giftMutation = api.gift.create.useMutation({
    onSettled: async () => {
      await utils.gift.getWishListGifts.invalidate();
    },
  });

  const initialGiftInputState = {
    name: "",
    link: "",
  };

  const [giftInput, setGiftInput] = React.useState(initialGiftInputState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function updateGiftInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setGiftInput({ ...giftInput, [name]: value });
  }

  function submitGift(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!giftInput.name) return;

    setIsSubmitting(true);

    giftMutation.mutate({
      name: giftInput.name,
      link: giftInput.link,
      wishListId: wishList.id,
    });
    setIsSubmitting(false);
    setGiftInput(initialGiftInputState);
  }

  return (
    <div className="border-2 border-solid border-yellow-600 p-2 text-white">
      <h1>Add New Gift</h1>
      <form onSubmit={submitGift}>
        <fieldset
          className="text-black"
          disabled={isSubmitting}
          name="giftInput"
        >
          {Object.entries(giftFormInputs).map(([inputName, { htmlInput }]) => {
            return (
              <div key={htmlInput.name}>
                <label className="text-white" htmlFor={htmlInput.name}>
                  {htmlInput.label}
                </label>
                <input
                  name={htmlInput.name}
                  type={htmlInput.type}
                  required={htmlInput.required}
                  onChange={updateGiftInput}
                  value={giftInput[inputName as keyof typeof giftInput]}
                ></input>
              </div>
            );
          })}
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
