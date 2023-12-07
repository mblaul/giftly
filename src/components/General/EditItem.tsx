import { Gift } from ".prisma/client";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import { SyntheticEvent, useCallback, useState } from "react";
import { api } from "~/utils/api";

const giftFormInputs = {
  name: {
    htmlInput: {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    className: "my-4 text-2xl font-bold",
  },
  link: {
    htmlInput: {
      name: "link",
      label: "Link",
      type: "text",
      required: false,
    },
    className: "truncate text-blue-700 underline",
  },
};

type GiftInputFormProps = {
  gift: Gift;
  mountInEditMode?: boolean;
};

export const EditItem = (props: GiftInputFormProps) => {
  const { gift, mountInEditMode = false } = props;
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(mountInEditMode);

  const initialGiftInputState = {
    name: gift.name,
    link: gift.link,
  };

  const { data: sessionData } = useSession();
  const utils = api.useContext();

  const giftEditMutation = api.gift.update.useMutation({
    onSuccess: () => {
      utils.wishList.getWishList.invalidate();
    },
  });

  function submitEdit(event: SyntheticEvent) {
    event.preventDefault();

    if (!giftInput.name) return;

    giftEditMutation.mutate({
      giftId: gift.id,
      name: giftInput.name,
      link: giftInput.link,
    });

    setIsEditModeEnabled(false);
  }

  const giftDeleteMutation = api.gift.delete.useMutation({
    onSettled: () => {
      utils.wishList.getWishList.invalidate();
    },
  });

  function deleteGift() {
    giftDeleteMutation.mutate({
      giftId: gift.id,
      wishListId: gift.wishListId,
    });
  }

  const [giftInput, setGiftInput] = useState(initialGiftInputState);

  function updateGiftInput(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setGiftInput({ ...giftInput, [name]: value });
  }

  const autoFocusCallback = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement && mountInEditMode) inputElement.focus();
  }, []);

  return (
    <div className="flex flex-grow flex-row items-center gap-2">
      <form className="overflow-hidden">
        <fieldset
          className="flex flex-auto flex-col"
          disabled={!isEditModeEnabled}
          name="giftInput"
        >
          {Object.entries(giftFormInputs).map(
            ([inputName, { className, htmlInput }]) => {
              const autoFocusRef =
                htmlInput.name === "name" ? autoFocusCallback : undefined;
              return (
                <input
                  key={htmlInput.name}
                  name={htmlInput.name}
                  className={classnames(
                    "w-full min-w-0 rounded border-2 border-solid p-2",
                    className,
                    { "border-transparent bg-white": !isEditModeEnabled },
                    { "border-black bg-slate-200": isEditModeEnabled }
                  )}
                  type={htmlInput.type}
                  required={htmlInput.required}
                  onChange={updateGiftInput}
                  //@ts-ignore
                  value={giftInput[inputName]}
                  ref={autoFocusRef}
                ></input>
              );
            }
          )}
        </fieldset>
      </form>
      <div className="flex basis-1/6 flex-col items-center justify-center">
        {sessionData?.user.id && (
          <>
            {sessionData.user.id === gift.userId && (
              <>
                {isEditModeEnabled && (
                  <div className="flex flex-grow flex-col items-center justify-center gap-2">
                    <div
                      className="cursor-pointer text-red-600"
                      onClick={deleteGift}
                    >
                      <TrashIcon className="w-6" />
                    </div>
                    <div
                      className="cursor-pointer text-green-600"
                      onClick={submitEdit}
                    >
                      <CheckIcon className="w-6" />
                    </div>
                  </div>
                )}
                {!isEditModeEnabled && (
                  <div
                    className="cursor-pointer text-gray-500"
                    onClick={() => setIsEditModeEnabled(true)}
                  >
                    <PencilIcon className="w-6" />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
