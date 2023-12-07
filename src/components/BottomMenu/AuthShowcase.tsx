import { Cog8ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Session } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";

type UserBubbleProps = {
  sessionData?: Session;
};

const UserBubble = (props: UserBubbleProps) => {
  // TODO - Add menu for user options
  return <UserCircleIcon className="w-10" />;
};

export const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-row items-center justify-between">
      <Cog8ToothIcon className="w-10" />
      <div>
        {sessionData ? (
          <UserBubble />
        ) : (
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};
