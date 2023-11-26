import React, { FunctionComponent, ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
  variant: number;
};

export const Header: FunctionComponent<HeaderProps> = (props) => {
  const { children, variant } = props;
  switch (variant) {
    case 1: {
      return <h1 className="text-lg font-bold">{children}</h1>;
    }
  }
};
