import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {WorkoutContext} from "../context/WorkoutContext";
import {fetchDailyStats} from "../utils/trainingSession";
import DonutChart from "./DonutChart";
import {elements} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {format} from "date-fns";

const DailyStats = ({home = true}) => {
    const {getTextStyles, getColors, fontFamily, colorScheme} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [dailyStats, setDailyStats] = useState({});
    const { workouts } = useContext(WorkoutContext);
    const today = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        const loadDailyStats = async () => {
            const stats = await fetchDailyStats();
            setDailyStats(stats);
        };

        loadDailyStats();
    }, [workouts]);

    /*const [todayStats, setTodayStats] = useState({});
    const { workouts } = useContext(WorkoutContext);

    useEffect(() => {
        const loadTodayStats = async () => {
            const stats = await fetchDailyStats();
            const today = format(new Date(), 'yyyy-MM-dd');
            setTodayStats(stats[today] || {
                exercisesCompleted: 0,
                workouts: 0,
                totalDuration: 0,
                totalCalories: 0,
            });
        };

        loadTodayStats();
    }, [workouts]);
*/



    return (
        <>
            {!home && (
                <View style={styles.statContainer}>
                    {Object.keys(dailyStats).map(date => (
                        <View key={date} style={styles.statCard}>
                            <Text style={styles.date}>{date}</Text>
                            <Text>Workouts: {dailyStats[date].workouts}</Text>
                            <Text>Exercises Completed: {dailyStats[date].exercisesCompleted}</Text>
                            <Text>Total Duration: {dailyStats[date].totalDuration} seconds</Text>
                            <Text>Total Calories: {dailyStats[date].totalCalories}</Text>
                        </View>
                    ))}
                </View>
            )}
            {home && (
                <View style={styles.donutChartContainer}>
                        <View style={styles.donutChartContainer}>
                            <Text>{today}</Text>
                            <View style={styles.boxStyle}>
                                <DonutChart
                                    key="exercises"
                                    percentage={dailyStats[today]?.exercisesCompleted}
                                    color={colors.baseColor}
                                    delay={1000}
                                    max={20}
                                />
                                <Text style={styles.headerCounterLabel}>Übungen</Text>
                            </View>
                            <View style={styles.boxStyle}>
                                <DonutChart
                                    key="calories"
                                    percentage={dailyStats[today]?.totalCalories}
                                    color={colors.baseColor}
                                    delay={1000}
                                    max={1000}
                                />
                                <Text style={styles.headerCounterLabel}>Kcal</Text>
                            </View>
                            <View style={styles.boxStyle}>
                                <DonutChart
                                    key="minutes"
                                    percentage={dailyStats[today]?.totalDuration / 60}
                                    color={colors.baseColor}
                                    delay={1000}
                                    max={240}
                                />
                                <Text style={styles.headerCounterLabel}>Minuten</Text>
                            </View>
                        </View>
                </View>
            )}
        </>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        image: {
            position: "absolute",
            top: 50,
            width: "100%",
            height: "100%",
            contentFit: "contain",
            tintColor: colors.quaternaryLabel
        },
        container: {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            //flexDirection: "column",
            //justifyContent: "space-evenly"
        },
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start"
        },
        workoutInfoBox: {
            //flexDirection: "row",
            //justifyContent: "space-between",
            //backgroundColor: colors.boxBackgroundTransparent,
            //padding: 10,
            //borderRadius: 10
        },
        donutChartContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly"
            //gap: 15,
            //alignItems: "flex-end"
        },
        content: {
            flex: 1,
        },
        boxStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
            //backgroundColor: colors.white
        },
        boxStyleLarge: {
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            gap: 10
            //backgroundColor: colors.white
        },
        headerCounterLabel: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            alignSelf: "center"
        },
        workoutInfoContainer: {
            alignItems: "flex-start",
            paddingBottom: 5,
            //marginTop: 10
            marginBottom: 5
        },
        firstTitleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            color: colors.label
        },
        titleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            marginTop: 15,
            color: colors.label
        },
        imageContainer: {
            top: 20,
            alignItems: "flex-end",
        },
        cameraStyle: {
            flex: 1,
            justifyContent: "flex-end",
            top: 5,
        },
        dateText: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            color: colors.label
        },
        greetingText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            color: colors.label
        },
        usernameText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_1,
            color: colors.label
        },
        workoutContainer: {
            padding: 10,
            backgroundColor: colors.secondary,
            borderRadius: elements.roundRadius,
            alignItems: "center",
            marginRight: 10,
            marginBottom: 10
        },
        workoutContainerSelected: {
            padding: 10,
            backgroundColor: colors.baseColor,
            borderRadius: elements.roundRadius,
            alignItems: "center",
            marginRight: 10,
            marginBottom: 10
        },
        workoutImage: {
            width: 70,
            height: 70,
            borderRadius: elements.imageRadius,
            tintColor: colors.label
        },
        workoutImageSelected: {
            width: 70,
            height: 70,
            borderRadius: elements.imageRadius,
            tintColor: colors.colorButtonLabel
        },
        workoutName: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: 5,
            color: colors.label
        },
        workoutNameSelected: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: 5,
            color: colors.colorButtonLabel
        },
        exerciseListContainer: {
            flex: 1,
            marginTop: 5,
            //marginBottom: 5
        },
        exerciseContainer: {
            flexDirection: "row",
        },
        exercises: {
            //backgroundColor: "blue",
            flexDirection: "column",
            flex: 1,
            //width: "50%",
            //gap: 10,
            //alignItems: "flex-end",
            justifyContent: "space-between",
        },
        exerciseImageContainer: {
            //backgroundColor: "red"
        },
        exerciseImage: {
            width: 100,
            height: 100,
            borderRadius: elements.imageRadius,
        },
        exerciseName: {
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            fontSize: textStyles.callout,
            paddingLeft: 5,
            paddingBottom: 15,
            width: "100%",
        },
        exerciseDetails: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.secondaryLabel,
            fontSize: textStyles.footnote,
            paddingLeft: 5,
            paddingTop: 2,
            width: "100%",
            height: "100%",
            alignSelf: "center",
        },
        smallIconContainer: {
            backgroundColor: colors.baseColor,
            borderRadius: elements.iconRadius,
            marginBottom: 5,
            padding: 5,
        },
        smallIcon: {
            width: 15,
            height: 15,
            tintColor: colors.colorButtonLabel,
        }
    })
}

const styles = StyleSheet.create({
    statContainer: {
        flex: 1,
        padding: 16,
    },
    statCard: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    date: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DailyStats;
