import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {createStyles, UnstyledButton, Text, Paper, Group, rem} from '@mantine/core';
import {
    TbChevronDown,
    TbChevronUp
} from "react-icons/tb";

const useStyles = createStyles((theme) => ({
    root: {
        backgroundImage: `linear-gradient(-60deg, #69db7c} 0%, #37b24d 100%)`,
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        display: 'flex',

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
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

export interface YearButtonProps {
    currentYear: number,
    onChangeYearEvent: (newYear: number) => void;
}

export function YearButton(props: YearButtonProps) {
    const {classes} = useStyles();
    const [date, setDate] = useState(new Date(2023, 9, 24));

    function addYear() {
        setDate((current) => dayjs(current).add(1, 'year').toDate());
        props.onChangeYearEvent(date.getFullYear());
    }

    function subtractYear() {
        setDate((current) => dayjs(current).subtract(1, 'year').toDate());
        props.onChangeYearEvent(date.getFullYear());
    }

    useEffect(() => {
        props.onChangeYearEvent(date.getFullYear());
    }, [date, props]);

    return (
        <div className={classes.root}>
            <div className={classes.controls}>
                <UnstyledButton
                    className={classes.control}
                    onClick={addYear}
                >
                    <TbChevronUp size="1rem" className={classes.controlIcon}/>
                </UnstyledButton>

                <div className={classes.date}>
                    <Text className={classes.day}>{dayjs(date).format('YYYY')}</Text>
                </div>

                <UnstyledButton
                    className={classes.control}
                    onClick={subtractYear}
                >
                    <TbChevronDown size="1rem" className={classes.controlIcon}/>
                </UnstyledButton>
            </div>
        </div>
    );
}