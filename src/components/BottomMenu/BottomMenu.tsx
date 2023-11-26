import React, { FunctionComponent, ReactNode } from "react";

type BottomMenuProps = {
  children: ReactNode;
};

const BottomMenu: FunctionComponent<BottomMenuProps> = (props) => {
  const { children } = props;
  return (
    <menu className="absolute bottom-0 z-50 w-screen p-5">{children}</menu>
  );
};

export default BottomMenu;
