import { ReactNode } from "react";

type BottomMenuProps = {
  children: ReactNode;
};

const BottomMenu = (props: BottomMenuProps) => {
  const { children } = props;
  return <menu className="w-screen p-5">{children}</menu>;
};

export default BottomMenu;
