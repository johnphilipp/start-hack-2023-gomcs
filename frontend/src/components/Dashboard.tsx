import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import Spinner from "./Spinner";
import { TransportStats } from "~/components/TransportStats";
import { DistanceStats, StatsSegmentsProps } from "~/components/DistanceStats";
import CO2Piechart from "~/components/CO2Piechart";

type Co2Data = {
  year: number;
  type: string;
  distance: number;
  co2: number;
};

const Dashboard = () => {
  const { data: sessionData, status } = useSession();

  const [co2Data, setCo2Data] = useState<Co2Data[]>([]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  useEffect(() => {
    if (sessionData) {
      const userId = sessionData.user.id;

      const fetchData = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/all/${userId}`
        );
        const data = await response.json();
        console.log(data);
        setCo2Data(data); // --> DATA NOW SAVED IN co2Data
      };
      fetchData();
    }
  }, [sessionData]);

  // TODO: change distance stats
  const distanceData: StatsSegmentsProps = {
    total: 5000,
    diff: 30,
    data: [
      {
        label: "Airplane",
        count: 5000 * 0.1,
        part: 10,
        color: "#d9480f",
      },
      {
        label: "Car",
        count: 5000 * 0.4,
        part: 40,
        color: "#e8590c",
      },
      {
        label: "Train",
        count: 5000 * 0.3,
        part: 20,
        color: "#f08c00",
      },
      {
        label: "Ferry",
        count: 5000 * 0.1,
        part: 10,
        color: "#fcc419",
      },
      {
        label: "Bike",
        count: 5000 * 0.2,
        part: 20,
        color: "#2f9e44",
      },
    ],
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Timeliner
        </h1>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
          {" "}
        </h2>
        <TransportStats />
        <div className="flex flex-row items-center items-stretch justify-center gap-4">
          <CO2Piechart />
          <DistanceStats
            total={distanceData.total}
            diff={distanceData.diff}
            data={distanceData.data}
          />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
