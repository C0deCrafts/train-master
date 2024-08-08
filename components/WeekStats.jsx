import {View, Text, StyleSheet} from 'react-native';
import DonutChart from "./DonutChart";
import {useAppStyle} from "../context/AppStyleContext";
import {eachDayOfInterval, endOfWeek, format, startOfWeek} from "date-fns";
import useHealthData from "../hook/useHealthData";
import {useAccountSetting} from "../context/AccountSettingContext";
import {de} from "date-fns/locale";
import Card from "./Card";
import BigDonutChart from "./BigDonutChart";
import useWorkoutStats from "../hook/useWorkoutStats";
import {useEffect, useMemo} from "react";

const WeekStats = ({date}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const {showStepsCount} = useAccountSetting();
    const {steps, getSteps} = useHealthData();
    const {dailyStats} = useWorkoutStats();

    const selectedDate = useMemo(() => format(date, 'yyyy-MM-dd'), [date]);

    useEffect(() => {
        //um die Steps für jeden Tag neu zu laden
        getSteps(date)
    }, [date]);

    const startDate = useMemo(() => startOfWeek(date, { weekStartsOn: 1 }), [date]);
    const endDate = useMemo(() => endOfWeek(date, { weekStartsOn: 1 }), [date]);
    const daysOfWeek = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }).slice(0, 7), [startDate, endDate]);
    const markedDate = useMemo(() => format(date, 'EEEE', { locale: de }), [date]);

    const weeklyStats = useMemo(() => {
        const stats = {};
        daysOfWeek.forEach(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            stats[dayKey] = dailyStats[dayKey] || {
                exercisesCompleted: 0,
                workouts: 0,
                totalDuration: 0,
                totalCalories: 0
            };
        });
        //console.log("STATS: ", stats)
        return stats;
    }, [dailyStats, daysOfWeek]);

    //fix rendering of 3 times
    return (
        <View>
            <View style={styles.donutChartContainer}>
                {showStepsCount && daysOfWeek.map(day => {
                    const dayName = format(day, 'EEEE', { locale: de });
                    const dayKey = format(day, 'yyyy-MM-dd');

                    //console.log("================================RENDER WOCHE================================")
                    //console.log(`Day ${dayName} (${dayKey}) - weeklyStats:`, weeklyStats[dayKey]);

                    return (
                        <View key={dayName} style={styles.boxStyle}>
                            <Text style={[
                                styles.headerCounterLabel,
                                dayName === markedDate && styles.currentDayLabel
                            ]}>
                                {dayName.charAt(0)}
                            </Text>
                            <DonutChart
                                key={dayName}
                                percentage={weeklyStats[dayKey]?.exercisesCompleted || 0} // Replace with real data
                                color={colors.baseColor}
                                delay={1000}
                                max={15}
                                withLabel={false}
                                radius={20}
                            />
                        </View>
                    );
                })}
            </View>
            <Card style={{marginTop: 20, paddingTop: 15, paddingHorizontal: 20}}>
                <View style={styles.bigChartContainer}>
                    <View>
                        <Text style={styles.maxText} numberOfLines={2} ellipsizeMode="tail">Abgeschlossene Workouts</Text>
                        <Text style={styles.detailsLarge}>{dailyStats[selectedDate]?.exercisesCompleted || 0}</Text>

                    </View>
                    <BigDonutChart
                        progress={dailyStats[selectedDate]?.exercisesCompleted || 0}
                        max={15}
                    />
                </View>
                    <View style={styles.detailsContainer}>
                        {showStepsCount && (
                            <View style={styles.container}>
                                <Text style={styles.text}>Schritte</Text>
                                <Text style={styles.details}>{steps[selectedDate] || 0}</Text>
                            </View>
                        )}
                        <View style={styles.container}>
                            <Text style={styles.text}>Minuten</Text>
                            <Text style={styles.details}>{Math.round((dailyStats[selectedDate]?.totalDuration || 0) / 60)} Min</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.textRight}>Kalorien</Text>
                            <Text style={styles.details}>{Math.round(dailyStats[selectedDate]?.totalCalories) || 0} kcal</Text>
                        </View>
                    </View>
            </Card>
        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flexDirection: "column",
        },
        donutChartContainer: {
            flexDirection: "row",
            justifyContent: "space-between"
        },
        boxStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
        },
        headerCounterLabel: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            alignSelf: "center",
        },
        currentDayLabel: {
            fontFamily: fontFamily.Poppins_Bold,
            color: colors.baseColor,
        },
        maxText: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            width: 150
        },
        text: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            textAlign: "left"
        },
        textRight: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            textAlign: "right"
        },
        detailsLarge: {
            color: colors.baseColor,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.largeTitle,
        },
        details: {
            color: colors.baseColor,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
        },
        detailsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
        },
        bigChartContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        }
    })
}

export default WeekStats;
