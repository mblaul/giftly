import { ReactNode } from "react";
import BottomMenu from "./BottomMenu/BottomMenu";
import { AuthShowcase } from "./BottomMenu/AuthShowcase";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
    <div className="flex-basis-5/6 container flex flex-grow flex-col gap-12 p-6">
      <header className="inline border-[3.5px] border-r-2 border-solid border-white p-4 text-left text-4xl font-bold tracking-tight text-white underline">
        <Link href="/">Giftly</Link>
      </header>
      {children}
    </div>
    <div className="flex-basis-1/6 sticky bottom-0 bg-[#15162c]">
      <BottomMenu>
        <AuthShowcase />
      </BottomMenu>
    </div>
  </main>
);
