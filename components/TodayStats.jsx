import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {WorkoutContext} from "../context/WorkoutContext";
import {fetchDailyStats} from "../utils/trainingSession";
import DonutChart from "./DonutChart";
import {useAppStyle} from "../context/AppStyleContext";
import {format} from "date-fns";
import useHealthData from "../hook/useHealthData";
import {useAccountSetting} from "../context/AccountSettingContext";
import useWorkoutStats from "../hook/useWorkoutStats";

const TodayStats = () => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const {showStepsCount} = useAccountSetting();
    const {steps} = useHealthData();
    const { dailyStats } = useWorkoutStats();
    const today = format(new Date(), 'yyyy-MM-dd');

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
                {dailyStats[today]?.totalDuration / 60 < 1 ? (
                    <View style={styles.boxStyle}>
                        <DonutChart
                            key="minutes"
                            percentage={dailyStats[today]?.totalDuration || 0}
                            color={colors.baseColor}
                            delay={1000}
                            max={240}
                        />
                        <Text style={styles.headerCounterLabel}>Sekunden</Text>
                    </View>
                ) : (
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
                )}
                {showStepsCount && (
                    <View style={styles.boxStyle}>
                        <DonutChart
                            key="minutes"
                            percentage={steps}
                            color={colors.baseColor}
                            delay={1000}
                            max={10000}
                        />
                        <Text style={styles.headerCounterLabel}>Schritte</Text>
                    </View>
                )}
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
