import {View, Text, StyleSheet} from 'react-native';
import DonutChart from "./DonutChart";
import {useAppStyle} from "../context/AppStyleContext";
import {eachDayOfInterval, endOfWeek, format, startOfWeek} from "date-fns";
import useHealthData from "../hook/useHealthData";
import {useAccountSetting} from "../context/AccountSettingContext";
import {de} from "date-fns/locale";
import {useContext, useEffect} from "react";
import Card from "./Card";
import BigDonutChart from "./BigDonutChart";
import {WorkoutContext} from "../context/WorkoutContext";

const WeekStats = () => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const {workouts} = useContext(WorkoutContext);

    const {showStepsCount} = useAccountSetting();
    const {steps} = useHealthData();

    const date = new Date();
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    const endDate = endOfWeek(date, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate }).slice(0, 7);
    const today = format(date, 'EEEE', { locale: de });

    return (
        <View style={styles.container}>
            <View style={styles.donutChartContainer}>
                {showStepsCount && daysOfWeek.map(day => {
                    const dayName = format(day, 'EEEE', { locale: de });
                    return (
                        <View key={dayName} style={styles.boxStyle}>
                            <Text style={[
                                styles.headerCounterLabel,
                                dayName === today && styles.currentDayLabel
                            ]}>
                                {dayName.charAt(0)}
                            </Text>
                            <DonutChart
                                key={dayName}
                                percentage={Math.floor(Math.random() * 10000)} // Replace with real data
                                color={colors.baseColor}
                                delay={1000}
                                max={10000}
                                withLabel={false}
                                radius={20}
                            />
                        </View>
                    );
                })}
            </View>
            <Card style={{marginTop: 20, padding: 15}}>
                <BigDonutChart
                    progress={5000}
                    max={20000}
                />
                <Text style={styles.text}>Schritte</Text>
                {steps ? (
                    <View style={styles.detailsContainer}>
                        <View style={styles.container}>
                            <Text style={styles.details}>{steps}</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.kcal}>205 KCAL</Text>
                        </View>
                    </View>
                ):(
                    <View style={styles.detailsContainer}>
                        <View style={styles.container}>
                            <Text style={styles.details}>0/0</Text>
                        </View>
                        <View style={styles.container}>
                            <Text style={styles.kcal}>KCAL</Text>
                        </View>
                    </View>
                )}
            </Card>
        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            //flex: 1,
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
        text: {
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            //paddingHorizontal: 10
        },
        details: {
            color: colors.baseColor,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_1,
        },
        detailsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            //paddingHorizontal: 10
        },
        kcal: {
            color: colors.baseColor,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_1,
        },
    })
}

export default WeekStats;
