import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {WorkoutContext} from "../context/WorkoutContext";
import {fetchDailyStats} from "../utils/trainingSession";
import DonutChart from "./DonutChart";
import {elements} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {format} from "date-fns";

const TodayStats = () => {
    const {getTextStyles, getColors, fontFamily, colorScheme} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [dailyStats, setDailyStats] = useState({});
    const {workouts} = useContext(WorkoutContext);
    const today = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        const loadDailyStats = async () => {
            const stats = await fetchDailyStats();
            setDailyStats(stats);
        };

        loadDailyStats();
    }, [workouts]);


    return (
            <View style={styles.donutChartContainer}>
                <View style={styles.boxStyle}>
                    <DonutChart
                        key="exercises"
                        percentage={dailyStats[today]?.exercisesCompleted || 0}
                        color={colors.baseColor}
                        delay={1000}
                        max={20}
                    />
                    <Text style={styles.headerCounterLabel}>Übungen</Text>
                </View>
                <View style={styles.boxStyle}>
                    <DonutChart
                        key="calories"
                        percentage={dailyStats[today]?.totalCalories || 0}
                        color={colors.baseColor}
                        delay={1000}
                        max={1000}
                    />
                    <Text style={styles.headerCounterLabel}>Kcal</Text>
                </View>
                <View style={styles.boxStyle}>
                    <DonutChart
                        key="minutes"
                        percentage={dailyStats[today]?.totalDuration / 60 || 0}
                        color={colors.baseColor}
                        delay={1000}
                        max={240}
                    />
                    <Text style={styles.headerCounterLabel}>Minuten</Text>
                </View>
            </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        donutChartContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly"
            //gap: 15,
            //alignItems: "flex-end"
        },
        boxStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
            //backgroundColor: colors.white
        },
        headerCounterLabel: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            alignSelf: "center"
        },
    })
}

export default TodayStats;
