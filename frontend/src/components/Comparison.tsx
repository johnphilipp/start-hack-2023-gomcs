import { useState } from "react";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";

type Co2Data = {
  year: number;
  type: string;
  distance: number;
  co2: number;
};

const Comparison: React.FC = () => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <div className="text-white">FIc pof</div>;
};

export default Comparison;
