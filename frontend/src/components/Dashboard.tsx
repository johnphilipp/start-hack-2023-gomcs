import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import Spinner from "./Spinner";
import {TransportProps, TransportStats} from "~/components/TransportStats";
import {DistanceStats, StatsSegmentsProps} from "~/components/DistanceStats";
import CO2Piechart, {CO2PiechartProps} from "~/components/CO2Piechart";
import {TbBike, TbBus, TbCar, TbPlane, TbQuestionMark, TbShip, TbTrain, TbWalk} from "react-icons/tb";
import {IconType} from "react-icons";
import {YearButton} from "~/components/YearButton";
import {createStyles} from "@mantine/core";

enum activity_type {
    IN_TRAIN= "IN_TRAIN", WALKING = "WALKING", IN_FERRY = "IN_FERRY", IN_PASSENGER_VEHICLE = "IN_PASSENGER_VEHICLE", IN_BUS = "IN_BUS", FLYING = "FLYING", ON_BICYCLE = "ON_BICYCLE"
}

const activityToStyleMap = new Map<activity_type, {label: string, color: string, icon: IconType}>([
    [activity_type.IN_TRAIN, {
        label: "Train",
        color: "#f08c00",
        icon: TbTrain
    }],
    [activity_type.WALKING, {
        label: "Walking",
        color: "#7950f2",
        icon: TbWalk
    }],
    [activity_type.IN_FERRY, {
        label: "Ferry",
        color: "#22b8cf",
        icon: TbShip
    }],
    [activity_type.IN_PASSENGER_VEHICLE, {
        label: "Car",
        color: "#e8590c",
        icon: TbCar
    }],
    [activity_type.IN_BUS, {
        label: "Bus",
        color: "#fcc419",
        icon: TbBus
    }],
    [activity_type.FLYING, {
        label: "Airplane",
        color: "#d9480f",
        icon: TbPlane
    }],
    [activity_type.ON_BICYCLE, {
        label: "Bicycle",
        color: "#20c997",
        icon: TbBike
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

const useStyles = createStyles((theme) => ({
    root: {
        backgroundImage: `linear-gradient(-60deg, #69db7c} 0%, #37b24d 100%)`,
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        display: 'flex',

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    }
}));

const Dashboard = () => {
    const { classes } = useStyles();
    const {data: sessionData, status} = useSession();

    const [selectedYear, setSelectedYear] = useState<number>(2023);
    const [co2Data, setCo2Data] = useState<DataPerYear[]>([]);
    const [distanceData, setDistanceData] = useState<StatsSegmentsProps>({
        data: [], diff: 0, total: 0, year: 2023
    });
    const [emissionData, setEmissionData] = useState<CO2PiechartProps>({
        data: [],
        total: 0
    });
    const [transportData, setTransportData] = useState<TransportProps>({
        data: [],
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
            // @ts-ignore
            color =  activityToStyleMap.get(activity.activity_type).color;
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

    function getNewDistanceData(totalDistance: number, dataOfCurrentYear: DataPerYear) {
        return {
            total: parseFloat((totalDistance / 1000)?.toFixed(0)),
            diff: diffFromPreviousYear(dataOfCurrentYear),
            year: !!dataOfCurrentYear.year ? dataOfCurrentYear.year : 2023,
            data: dataOfCurrentYear?.activities.map(activity => ({
                count: !!activity?.distance ? parseFloat((activity?.distance / 1000)?.toFixed(0)) : 0,
                part: !!activity?.distance ? parseFloat(((activity?.distance / totalDistance) * 100).toFixed(1)) : 0,
                color: getColorForActivity(activity),
                label: getLabelForActivity(activity),
            })).sort((a, b) => b.count - a.count)
        };
    }

    function getTotalEmission(dataOfCurrentYear: DataPerYear) {
        return dataOfCurrentYear.activities.reduce((accumulator, currentValue) => accumulator + (currentValue?.co2 ? currentValue.co2 : 0), 0);
    }

    function getIconForActivity(activity: Activity) {
        let icon = TbQuestionMark
        if(!!activity?.activity_type && activityToStyleMap.has(activity?.activity_type)) {
            // @ts-ignore
            icon = activityToStyleMap.get(activity.activity_type.toString())?.icon;
        }
        return icon;
    }

    function getNewEmissionData(totalEmission: number, dataOfCurrentYear: DataPerYear): CO2PiechartProps {
        return {
            total: totalEmission,
            data: dataOfCurrentYear?.activities.map(activity => ({
                value: !!activity?.co2 ? parseFloat((activity?.co2)?.toFixed(0)) : 0,
                icon: getIconForActivity(activity),
                name: getLabelForActivity(activity),
            })).sort((a, b) => b.value - a.value)
        };
    }

    function getNewTransportData(dataOfCurrentYear: DataPerYear): TransportProps {
        return {
            data: dataOfCurrentYear?.activities.map(activity => ({
                co2: !!activity?.co2 ? parseFloat((activity?.co2)?.toFixed(0)) : 0,
                icon: getIconForActivity(activity),
                label: getLabelForActivity(activity),
                distance: !!activity?.distance ? parseFloat((activity?.distance / 1000)?.toFixed(0)) : 0,
            })).sort((a, b) => b.co2 - a.co2)
        };
    }

    useEffect(() => {
        if (sessionData) {
            const userId = sessionData.user.id;

            const fetchData = async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/all/${userId}`
                );
                console.log({response});
                if (response.status !== 200) {
                    <>No Data</>
                    return;
                }
                const data = await response.json();
                setCo2Data(data); // --> DATA NOW SAVED IN co2Data
                const yearIdx = data.findIndex((dataPerYear: DataPerYear) => dataPerYear.year == selectedYear)
                if(yearIdx !== -1) {
                    const dataOfCurrentYear: DataPerYear = data.at(yearIdx);
                    const totalDistance = getTotalDistance(dataOfCurrentYear);
                    const totalEmission = getTotalEmission(dataOfCurrentYear);
                    const newDistanceData: StatsSegmentsProps = getNewDistanceData(totalDistance, dataOfCurrentYear)
                    const newEmissionData: CO2PiechartProps = getNewEmissionData(totalEmission, dataOfCurrentYear)
                    const newTransportData: TransportProps = getNewTransportData(dataOfCurrentYear)
                    setDistanceData(newDistanceData);
                    setEmissionData(newEmissionData);
                    setTransportData(newTransportData)
                }
            }
            fetchData();
        }
    }, [sessionData, selectedYear]);

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


    function handleYearEvent(year: number) {
        setSelectedYear(year)
    }

    return (
        <>
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    Green Path
                </h1>

                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
                    {" "}
                </h2>
                <div className={classes.root}>
                    <YearButton currentYear={selectedYear} onChangeYearEvent={handleYearEvent}/>
                    <TransportStats data={transportData.data}/>
                </div>
                <div className="flex flex-row flex-wrap items-center items-stretch justify-center gap-4">
                    <CO2Piechart total={emissionData.total}  data={emissionData.data}/>
                    <DistanceStats
                            total={distanceData.total}
                            diff={distanceData.diff}
                            data={distanceData.data}
                            year={selectedYear}
                        />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
