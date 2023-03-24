import {createStyles, Table, Progress, Anchor, Text, Group, ScrollArea, rem} from '@mantine/core';
import React from "react";

interface ComparisonTableProps {
    data: {
        title: string;
        activities: {
            co2: number;
            distance: number;
        }[];
        year: number;
    }[];
}

const useStyles = createStyles((theme) => ({
    bigNumber: {
        fontSize: rem(24),
        fontWeight: 700,
        color: '#e03131',
        lineHeight: 1.5,
        marginBottom: 5,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
    label: {
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: theme.fontSizes.xs,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: theme.colors.gray[6],
        lineHeight: 1.2,
    },
}));

export function ComparisonTable({data}: ComparisonTableProps) {
    const { classes } = useStyles();
    function getTotalCO2(row: { title: string; activities: { co2: number; distance: number }[]; year: number }) {
        return row.activities.reduce((accumulator, currentValue) => accumulator + (currentValue?.co2 ? currentValue.co2 : 0), 0);
    }

    function getTotalDistanceInMeters(row: { title: string; activities: { co2: number; distance: number }[]; year: number }) {
        return row.activities.reduce((accumulator, currentValue) => accumulator + (currentValue?.distance ? currentValue.distance : 0), 0);
    }

    const rows = data.sort((a, b) => b.year - a.year).map((row) => {

        return (
            <tr key={row.title}>
                <td>{row.year}</td>
                <td>{getTotalCO2(row).toFixed(1)}</td>
                <td>{(getTotalDistanceInMeters(row) / 1000).toFixed(0)}</td>
            </tr>
        );
    });

    function getTotalCO2OverallYears() {
        return data.reduce((accumulator, currentYear) => accumulator + (getTotalCO2(currentYear)), 0);
    }

    return (
        <div className="max-w-fit">
            <Text className={classes.label}>Total (over years)</Text>
            <Text className={classes.bigNumber}>{getTotalCO2OverallYears().toFixed(0)}kg CO<sub>2</sub></Text>
            <ScrollArea>
                <Table sx={{maxWidth: 400}} verticalSpacing="xs">
                    <thead>
                    <tr>
                        <th>Year</th>
                        <th>CO<sub>2</sub> (kg)</th>
                        <th>Distance (km)</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </ScrollArea>
        </div>
    );
}