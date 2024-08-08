import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import {format} from "date-fns";
import {de} from "date-fns/locale";
import {Image} from "expo-image";
import {icons} from "../constants";
import WeekStats from "./WeekStats";
import {useEffect, useState} from "react";

const Calendar = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [date, setDate] = useState(new Date());
    const [isNextDisabled, setIsNextDisabled] = useState(false);
    const formattedDate = format(date, 'EEEE, dd MMM yyyy', { locale: de });

    const goToPreviousDay = () => {
        //console.log("Hier gehts zum vorherigen Tag zum Testen")
        //später wird der Button gesperrt, wenn es keine wöchentlich abgeschlossenen Übungen mehr gibt
        let newDate = new Date(date);
        newDate.setDate(date.getDate() - 1);
        setDate(newDate);
    }

    const goToNextDay = () => {
        //console.log("Hier gehts zum nächsten Tag, außer er ist der heutige Tag, dann ist der Button gesperrt")
        let newDate = new Date(date);
        newDate.setDate(date.getDate() + 1);
        setDate(newDate);
    }

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Setze die Uhrzeit auf Mitternacht, um nur das Datum zu vergleichen
        setIsNextDisabled(date >= today);
    }, [date]);

    return (
        <View>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={goToPreviousDay}>
                    <Image style={styles.image} source={icons.back}/>
                </TouchableOpacity>
                <Text style={styles.titleText}>{formattedDate}</Text>
                <Image style={styles.image} source={icons.calendar}/>
                <TouchableOpacity onPress={goToNextDay} disabled={isNextDisabled}>
                    <Image style={styles.image} source={icons.forward}/>
                </TouchableOpacity>
            </View>
            <WeekStats date={date}/>
        </View>
    );
};

export default Calendar;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            padding: 20,
        },
        calendarHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 15,
            marginBottom: 10,
        },
        titleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            color: colors.label,
            textAlign: "center"
        },
        text: {
            color: colors.label
        },
        image: {
            width: 30,
            height: 30,
            contentFit: "contain",
            tintColor: colors.baseColor
        },
    });
};
