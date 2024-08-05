import {
    ScrollView,
    StyleSheet,
    Text, View
} from 'react-native'
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {Video} from "expo-av";
import {useAppStyle} from "../../../../context/AppStyleContext";
import CustomHeader from "../../../../components/CustomHeader";
import Card from "../../../../components/Card";
import {useContext, useState, useCallback} from "react";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import ExerciseNavigation from "../../../../components/ExerciseNavigation";
import {SafeAreaView} from "react-native-safe-area-context";

const Exercises = () => {
    const { exercise } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const { exerciseVideos, startExerciseTimer, stopExerciseTimer, completeCurrentExercise } = useContext(WorkoutContext);

    // Parse exercise JSON and initialize state
    const exercises = exercise ? JSON.parse(exercise) : {};
    const [index, setIndex] = useState(0);
    const [currentSets, setCurrentSets] = useState(exercises.exercises[0]?.sets || 0);

    const current = exercises.exercises[index];
    const videoUrl = exerciseVideos[current.id] || ""

    // useFocusEffect wird ausgeführt, wenn der Bildschirm in den Fokus kommt
    useFocusEffect(
        useCallback(() => {
            // Timer starten, wenn der Bildschirm in den Fokus kommt
            startExerciseTimer();
            //console.log("Exercises Screen is focused and timer started");
        }, [])
    );

    const handleCompleteSet = async () => {
        stopExerciseTimer();

        if (currentSets > 1) {
            setCurrentSets(currentSets - 1);
            router.navigate({
                pathname: "(noTabs)/start/rest",
                params: {
                    exercise: JSON.stringify(exercises.exercises),
                    currentIndex: index,
                    rest: current.rest,
                    currentSet: current.sets - currentSets + 1,
                    totalSets: current.sets, // Gesamtanzahl der Sätze
                }
            });
        } else {
            //Letzter Satz - hier komme ich zum rest screen und die duration wurde schon gestoppt
            const completedExercise = {
                exerciseId: exercises.exercises[index].id,
                MET: exercises.exercises[index].MET,
                ...(exercises.exercises[index].sets && {sets: exercises.exercises[index].sets}),
                ...(exercises.exercises[index].repetitions && {repetitions: exercises.exercises[index].repetitions})
            };
            //console.log(`Hier wird im Exercises gespeichert: Completing exercise: ${JSON.stringify(completedExercise)}`);
            await completeCurrentExercise(completedExercise);

            // Da dies der letzte Satz war, führe die Logik aus, um zur nächsten Übung zu wechseln
            if (index + 1 < exercises.exercises.length) {
                const nextIndex = index + 1;
                setIndex(nextIndex);
                setCurrentSets(exercises.exercises[nextIndex].sets); // Setzt die Sätze für die nächste Übung

                // Hier zusätzlich navigieren, damit man ein letztes Mal auf den Rest Screen kommt, wo die nächste Übung angezeigt wird.
                router.navigate({
                    pathname: "(noTabs)/start/rest",
                    params: {
                        exercise: JSON.stringify(exercises.exercises),
                        currentIndex: index,
                        rest: current.rest,
                        currentSet: current.sets - currentSets + 1,
                        totalSets: current.sets, // Gesamtanzahl der Sätze
                    }
                });
            } else {
                // ALLERLETZTE Übung und ALLERLETZTER Satz
                router.replace("(tabs)/(training)/training")
            }
        }
    };

    const updateCurrentSets = (newIndex) => {
        setCurrentSets(exercises.exercises[newIndex]?.sets || 0);
    };

    return (
        <>
            <CustomHeader title={current.name}/>
            <SafeAreaView style={styles.container}>
                {videoUrl && (
                    <Video
                        source={{uri: videoUrl}}
                        style={styles.video}
                        resizeMode="contain"
                        useNativeControls={false}
                        isLooping
                        shouldPlay
                    />
                )}
                <View style={styles.content}>
                    <View style={styles.cardContainer}>
                        {current.sets && (
                            <Card style={styles.cardStyle}>
                                <Text style={styles.cardHeader}>Sätze</Text>
                                <Text style={styles.cardContent}>{current.sets}x</Text>
                            </Card>
                        )}
                        {current.repetitions && (
                            <Card style={styles.cardStyle}>
                                <Text style={styles.cardHeader}>WH</Text>
                                <Text style={styles.cardContent}>{current.repetitions}x</Text>
                            </Card>
                        )}
                        {current.weight && (
                            <Card style={styles.cardStyle}>
                                <Text style={styles.cardHeader}>Gewicht</Text>
                                <Text style={styles.cardContent}>{current.weight} kg</Text>
                            </Card>
                        )}
                    </View>
                    <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
                        <Text style={styles.information}><Text style={styles.bold}>Infos:</Text> {current.description}</Text>
                        {current.additionalInfo && (
                            <Text style={styles.additionalInfo}><Text style={styles.bold}>Zusatzinfos:</Text> {current.additionalInfo}</Text>
                        )}
                        {current.heartRateZone && (
                            <Text style={styles.additionalInfo}><Text style={styles.bold}>Heart Rate:</Text> {current.heartRateZone}</Text>
                        )}
                    </ScrollView>
                </View>
                <ExerciseNavigation
                    index={index}
                    exercises={exercises.exercises}
                    handleCompleteSet={handleCompleteSet}
                    setIndex={setIndex}
                    currentSet={currentSets}
                    updateCurrentSets={updateCurrentSets}
                />
            </SafeAreaView></>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingTop: -60
        },
        content: {
            backgroundColor: colors.secondary,
            flex: 1,
            paddingHorizontal: 20,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        imageContainer: {
            flexDirection: "row"
        },
        cardContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 15,
            marginBottom: 5,
        },
        cardStyle: {
            backgroundColor: colors.baseColor,
            width: "30%"
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
        description: {
            fontSize: textStyles.body,
            textAlign: "justify",
        },
        video: {
            height: 220,
            marginTop: 0,
        },
        information: {
            textAlign: "justify",
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.body,
            color: colors.label
        },
        additionalInfo: {
            marginTop: 10,
            textAlign: "justify",
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.body,
            color: colors.label
        },
        scrollBox: {
            flex: 1
        },
        bold: {
            fontFamily: fontFamily.Poppins_SemiBold
        }
    })
}

export default Exercises;
