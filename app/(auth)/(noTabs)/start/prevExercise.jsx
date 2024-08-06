import {View, Text, ScrollView, StyleSheet, AppState} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {useContext, useEffect, useState} from "react";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {Video} from "expo-av";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import Card from "../../../../components/Card";
import CustomButton from "../../../../components/CustomButton";
import elementStyles from "../../../../constants/elementStyles";
import Animated, {FadeInDown} from "react-native-reanimated";
import useTimer from "../../../../utils/useTimer";

const PrevExercise = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const { exercise, currentIndex, timeLeft:initialTimeLeft } = useLocalSearchParams();
    const { exerciseVideos } = useContext(WorkoutContext);

    const exercises = exercise ? JSON.parse(exercise) : {};
    const nextIndex = parseInt(currentIndex) + 1
    const nextExercise = exercises[nextIndex];
    const videoUrl = exerciseVideos[nextExercise?.id] || ""

    const timeLeft = useTimer(initialTimeLeft); // Verwende den Timer-Hook

    const goBackTwice = () => {
        router.back();
        router.back();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{nextExercise.name || "Keine Übung gefunden"}</Text>
            </View>
            {videoUrl && (
                <Video
                    source={{ uri: videoUrl }}
                    style={styles.video}
                    resizeMode="contain"
                    useNativeControls={false}
                    shouldPlay
                    isLooping
                />
            )}
            <View style={styles.cardContainer}>
                {nextExercise.sets && (
                    <Card style={styles.cardStyle}>
                        <Text style={styles.cardHeader}>Sätze</Text>
                        <Text style={styles.cardContent}>{nextExercise.sets}x</Text>
                    </Card>
                )}
                {nextExercise.repetitions && (
                    <Card style={styles.cardStyle}>
                        <Text style={styles.cardHeader}>WH</Text>
                        <Text style={styles.cardContent}>{nextExercise.repetitions}x</Text>
                    </Card>
                )}
                {nextExercise.weight && (
                    <Card style={styles.cardStyle}>
                        <Text style={styles.cardHeader}>Gewicht</Text>
                        <Text style={styles.cardContent}>{nextExercise.weight} kg</Text>
                    </Card>
                )}
            </View>
            <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
                <Animated.Text
                    entering={FadeInDown.delay(100).duration(300)}
                    style={styles.information}><Text style={styles.bold}>Infos:</Text> {nextExercise.description || "Keine Beschreibung"}</Animated.Text>
                <Animated.Text
                    entering={FadeInDown.delay(200).duration(300)}
                    style={styles.information}><Text style={styles.bold}>Zusatzinfos:</Text> {nextExercise.additionalInfo || "Keine Zusatzinfos"}</Animated.Text>
            </ScrollView>
            <Text style={styles.timerText}>Verbleibende Zeit bis zur nächsten Übung:</Text>
            <Text style={styles.time}>{timeLeft}s</Text>
            <CustomButton title={"Zur nächsten Übung"} handlePress={goBackTwice} containerStyles={styles.button}/>
        </SafeAreaView>
    );
};

const createStyles = (textStyles, colors, fontFamily) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.baseColor,
        paddingHorizontal: 20
    },
    scrollContainer: {
        padding: 20,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        textAlign: "center",
        color: colors.colorButtonLabel,
        fontSize: textStyles.title_1,
        fontFamily: fontFamily.Poppins_SemiBold
    },
    video: {
        alignSelf: 'center',
        width: 260,
        height: 160,
        marginBottom: 20,
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        fontSize: textStyles.body,
        color: colors.colorButtonLabel,
        fontFamily: fontFamily.Poppins_Regular
        //marginBottom: 10,
    },
    timerText: {
        fontSize: textStyles.body - 1,
        textAlign: "center",
        color: colors.colorButtonLabel,
        fontFamily: fontFamily.Poppins_Regular,
        marginVertical: 20,
    },
    time: {
        fontSize: textStyles.title_1,
        fontFamily: fontFamily.Poppins_SemiBold,
        color: colors.colorButtonLabel,
        textAlign: "center",
        marginBottom: 20
    },
    button: {
        backgroundColor: colors.baseColor,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: colors.colorButtonLabel,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 10
    },
    cardStyle: {
        backgroundColor: colors.baseColor,
        borderColor: colors.colorButtonLabel,
        borderWidth: 3,
        width: "30%",
    },
    cardHeader: {
        fontFamily: fontFamily.Poppins_Regular,
        fontSize: textStyles.footnote,
        color: colors.colorButtonLabel,
        textAlign: "center"
    },
    cardContent: {
        fontFamily: fontFamily.Poppins_SemiBold,
        fontSize: textStyles.body,
        color: colors.colorButtonLabel,
        textAlign: "center"
    },
    scrollBox: {
        flex: 1,
        backgroundColor: colors.secondary,
        borderRadius: elementStyles.cardRadius,
        padding: 10,
        borderColor: colors.colorButtonLabel,
        borderWidth: 3,
    },
    information: {
        textAlign: "justify",
        fontSize: textStyles.body,
        color: colors.label,
    },
    bold: {
        fontFamily: fontFamily.Poppins_SemiBold
    }
});


export default PrevExercise;