import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center">
      <ArrowPathIcon className=" w-4/12 animate-spin text-white" />
    </div>
  );
};
