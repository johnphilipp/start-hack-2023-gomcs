import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import Spinner from "./Spinner";
import {TransportStats} from "~/components/TransportStats";
import {DistanceStats, StatsSegmentsProps} from "~/components/DistanceStats";
import CO2Piechart from "~/components/CO2Piechart";

enum activity_type {
    IN_TRAIN= "IN_TRAIN", WALKING = "WALKING", IN_FERRY = "IN_FERRY", IN_PASSENGER_VEHICLE = "IN_PASSENGER_VEHICLE", IN_BUS = "IN_BUS", FLYING = "FLYING", ON_BICYCLE = "ON_BICYCLE"
}

const activityToStyleMap = new Map<activity_type, {label: string, color: string}>([
    [activity_type.IN_TRAIN, {
        label: "Train",
        color: "#f08c00",
    }],
    [activity_type.WALKING, {
        label: "Walking",
        color: "#7950f2",
    }],
    [activity_type.IN_FERRY, {
        label: "Ferry",
        color: "#fcc419",
    }],
    [activity_type.IN_PASSENGER_VEHICLE, {
        label: "Car",
        color: "#e8590c",
    }],
    [activity_type.IN_BUS, {
        label: "Bus",
        color: "#22b8cf",
    }],
    [activity_type.FLYING, {
        label: "Airplane",
        color: "#d9480f",
    }],
    [activity_type.ON_BICYCLE, {
        label: "Bicycle",
        color: "#20c997",
    }]
]);


interface Activity {
    activity_type?: activity_type;
    co2?: number;
    distance?: number;
}

type DataPerYear = {
    year?: number;
    activities: Activity[]
}


const Dashboard = () => {
    const {data: sessionData, status} = useSession();

    const [selectedYear, setSelectedYear] = useState<number>(2023);
    const [co2Data, setCo2Data] = useState<DataPerYear[]>([]);
    const [distanceData, setDistanceData] = useState<StatsSegmentsProps>({
        data: [], diff: 0, total: 0
    });

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner/>
            </div>
        );
    }

    function diffFromPreviousYear(dataOfCurrentYear: DataPerYear) {
        // TODO: to be implemented
        return 30;
    }

    function getTotalDistance(dataOfCurrentYear: DataPerYear) {
        return dataOfCurrentYear.activities.reduce((accumulator, currentValue) => accumulator + (currentValue?.distance ? currentValue.distance : 0), 0);
    }

    function getColorForActivity(activity: Activity): string {
        let color = '#C1C2C5'
        // @ts-ignore
        if(!!activity?.activity_type && activityToStyleMap.has(activity.activity_type)) {
            console.log(activity.activity_type)
            // @ts-ignore
            color =  activityToStyleMap.get(activity.activity_type).color;
            console.log("color2:",color)
        }
        return color;
    }

    function getLabelForActivity(activity: Activity): string {
        let label = 'Unknown'
        if(!!activity?.activity_type && activityToStyleMap.has(activity?.activity_type)) {
            // @ts-ignore
            label = activityToStyleMap.get(activity.activity_type.toString())?.label;
        }
        return label;
    }

    useEffect(() => {
        if (sessionData) {
            const userId = sessionData.user.id;

            const fetchData = async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/all/${userId}`
                );
                const data = await response.json();
                setCo2Data(data); // --> DATA NOW SAVED IN co2Data
                const yearIdx = data.findIndex((dataPerYear: DataPerYear) => dataPerYear.year == selectedYear)
                if(yearIdx !== -1) {
                    console.log("BOOM")
                    console.log({activityToStyleMap})
                    const dataOfCurrentYear: DataPerYear = data.at(yearIdx);
                    const totalDistance = getTotalDistance(dataOfCurrentYear);
                    const newDistanceData: StatsSegmentsProps = {
                        total: totalDistance,
                        diff: diffFromPreviousYear(dataOfCurrentYear),
                        data: dataOfCurrentYear?.activities.map(activity => ({
                            count: !!activity?.distance ? parseFloat((activity?.distance)?.toPrecision(1)) : 0,
                            part: !!activity?.distance ? parseFloat(((activity?.distance / totalDistance) * 100).toPrecision(1)) : 0,
                            color: getColorForActivity(activity),
                            label: getLabelForActivity(activity),
                        })).sort((a, b) => b.count - a.count)
                    }

                    setDistanceData(newDistanceData);
                }
            }
            fetchData();
        }
    }, [sessionData]);

    /*
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
        };*/

    return (
        <>
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    Timeliner
                </h1>

                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
                    {" "}
                </h2>
                <TransportStats/>
                <div className="flex flex-row flex-wrap items-center items-stretch justify-center gap-4">
                    <CO2Piechart/>
                    {
                        distanceData && <DistanceStats
                            total={distanceData.total}
                            diff={distanceData.diff}
                            data={distanceData.data}
                        />
                    }
                </div>
            </div>
        </>
    );
};

export default Dashboard;
