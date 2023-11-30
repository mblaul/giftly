import React, { FunctionComponent, ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
  variant: number;
};

export const Header: FunctionComponent<HeaderProps> = (props) => {
  const { children, variant } = props;
  switch (variant) {
    case 1: {
      return <h1 className="my-4 text-2xl font-bold">{children}</h1>;
    }
    case 2: {
      return <h2 className="my-2 text-lg font-bold">{children}</h2>;
    }
  }
};
