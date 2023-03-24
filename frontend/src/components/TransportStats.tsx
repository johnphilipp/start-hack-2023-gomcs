import {createStyles, Text, Paper, Group, rem} from '@mantine/core';
import {IconType} from "react-icons";

const useStyles = createStyles((theme) => ({
    icon: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing.lg,
        color: '#2f9e44',
    },

    stat: {
        minWidth: rem(98),
        paddingTop: theme.spacing.xl,
        minHeight: rem(140),
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.white,
    },

    label: {
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: theme.fontSizes.xs,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        color: theme.colors.gray[6],
        lineHeight: 1.2,
    },

    value: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        color: theme.black,
    },

    count: {
        color: theme.colors.gray[6],
    },

    day: {
        fontSize: rem(44),
        fontWeight: 700,
        color: theme.white,
        lineHeight: 1,
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    month: {
        fontSize: theme.fontSizes.sm,
        color: theme.white,
        lineHeight: 1,
        textAlign: 'center',
    },

    controls: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: `calc(${theme.spacing.xl} * 2)`,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 0,
            marginBottom: theme.spacing.xl,
        },
    },

    date: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },

    control: {
        height: rem(28),
        width: '100%',
        color: '#b2f2bb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        transition: 'background-color 50ms ease',

        [theme.fn.smallerThan('xs')]: {
            height: rem(34),
            width: rem(34),
        },

        '&:hover': {
            backgroundColor: '#51cf66',
            color: theme.white,
        },
    },

    controlIcon: {
        [theme.fn.smallerThan('xs')]: {
            transform: 'rotate(-90deg)',
        },
    },
}));

export interface TransportProps {
    data: {
        icon: IconType,
        label: string,
        distance: number
        co2: number
    }[];
}

export function TransportStats({data}: TransportProps) {
    const {classes} = useStyles();

    const stats = data.map((stat) => (
        <Paper className={classes.stat} radius="md" shadow="md" p="xs" key={stat.label}>
            <stat.icon size={32} className={classes.icon}/>
            <div>
                <Text className={classes.label}>{stat.label}</Text>
                <Text fz="xs" className={classes.count}>
                    <span className={classes.value}>{stat.distance}km</span>
                </Text>
                <Text fz="xs" className={classes.count}>
                    <span className={classes.value}>{stat.co2}kg CO<sub>2</sub></span>
                </Text>
            </div>
        </Paper>
    ));

    return (
        <Group sx={{flex: 1}}>{stats}</Group>
    );
}