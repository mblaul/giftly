import { close } from "inspector";
import React, { FunctionComponent, ReactNode, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type DialogProps = {
  children: ReactNode;
};

export const Dialog: FunctionComponent<DialogProps> = (props) => {
  const { children } = props;
  const idRef = useRef(uuidv4());
  const dialogRef = useRef(null);

  function showDialog() {}

  function closeDialog() {}

  return (
    <div onClick={showDialog}>
      {children}
      <dialog
        id={idRef.current}
        ref={dialogRef}
        className="flex h-1/5 w-10/12 flex-col rounded p-4"
      >
        Test Form!
        <form method="dialog">
          <button onClick={closeDialog}>Close</button>
        </form>
      </dialog>
    </div>
  );
};
