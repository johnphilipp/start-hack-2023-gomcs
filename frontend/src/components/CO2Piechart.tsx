import React, {PureComponent} from 'react';
import {PieChart, Pie, Sector, ResponsiveContainer} from 'recharts';
import {Group, Paper, rem, Text} from "@mantine/core";
import {TbArrowDown, TbPlane} from "react-icons/tb";
import {
    TbBike,
    TbWalk,
    TbTrain,
    TbChevronDown,
    TbChevronUp, TbCar, TbShip, TbBus
} from "react-icons/tb";
import theme from "tailwindcss/defaultTheme";

const data = [
    {name: 'Walk', value: 400, icon: TbWalk},
    {name: 'Bike', value: 300, icon: TbBike},
    {name: 'Car', value: 300, icon: TbCar},
    {name: 'Airplane', value: 200, icon: TbPlane},
];

const renderActiveShape = (props: { cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any; endAngle: any; fill: any; payload: any; percent: any; value: any; }) => {
    const RADIAN = Math.PI / 180;
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <payload.icon color={'#2f9e44'} x={cx - 32} y={cy - 32} size={64} />
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text z={1} x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor}
                  fill="#333">{`${value}kg`}</text>
{/*            <text z={1} x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>*/}
        </g>
    );
};

export default class CO2Piechart extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si';

    state = {
        activeIndex: 0,
    };

    onPieEnter = (_: any, index: any) => {
        this.setState({
            activeIndex: index,
        });
    };

    render() {
        return (
            <Paper withBorder p="md" radius="md">
                <Group align="flex-start" spacing="xs">
                    <Text fz="xl" fw={700}>
                        CO2 Emissions in 2023
                    </Text>
                </Group>
                <Group align="flex-start">
                    <Text color="#868e96" fz="lg" fw={700}>
                        Total 4000kg
                    </Text>
                </Group>
                <PieChart width={400} height={300} >
                    <Pie
                        activeIndex={this.state.activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#2f9e44"
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                    />
                </PieChart>
            </Paper>
        );
    }
}
