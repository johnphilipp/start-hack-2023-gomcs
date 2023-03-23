import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";
import { TransportStats } from "./TransportStats";

type Co2Data = {
  year: number;
  type: string;
  distance: number;
  co2: number;
};

const Comparison: React.FC = () => {
  const { data: sessionData, status } = useSession();
  const [co2Data, setCo2Data] = useState<Co2Data[]>([]);

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
