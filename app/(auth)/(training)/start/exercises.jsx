import {
    ScrollView,
    StyleSheet,
    Text, View
} from 'react-native'
import {router, useLocalSearchParams} from "expo-router";
import {Video} from "expo-av";
import {useAppStyle} from "../../../../context/AppStyleContext";
import CustomHeader from "../../../../components/CustomHeader";
import Card from "../../../../components/Card";
import {useContext, useEffect, useState} from "react";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import ExerciseNavigation from "../../../../components/ExerciseNavigation";

const Exercises = () => {
    const { exercise } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const { exerciseVideos } = useContext(WorkoutContext);
    const styles = createStyles(textStyles, colors, fontFamily);

    // Parse exercise JSON and initialize state
    const exercises = exercise ? JSON.parse(exercise) : {};
    const [index, setIndex] = useState(0);
    const [currentSets, setCurrentSets] = useState(exercises.exercises[0]?.sets || 0);

    const current = exercises.exercises[index];
    const videoUrl = exerciseVideos[current.id] || ""

    //    const [currentSets, setCurrentSets] = useState(current.sets || 0); ????


    useEffect(() => {
        //console.log("currentIndex: ", index)
        //console.log("rest: ", current.rest)
        //console.log("currentSet: ", currentSets)
        //console.log("totalSets: ", totalSets)
    }, [index, current.rest]);
    //const [currentSets, setCurrentSets] = useState(() => current.sets || 0);

    /*useEffect(() => {
        if (exercises.exercises.length > 0 && current.sets) {
            setCurrentSets(current.sets);
        }
    }, [index, exercises]);*/

    /*useEffect(() => {
        // Update currentSets when index changes

        //dieser useEffect setzt mein current set zurück.... das solls nicht
        if (current) {
            setCurrentSets(current.sets || 0);
        }
    }, [index, current]);*/

    /*useEffect(() => {
        console.log("CurrentSETS: ", currentSets);
    }, [currentSets]);*/

    const handleCompleteSet = () => {
        console.log("currentSets: ", currentSets);
        if (currentSets > 1) {
            setCurrentSets(currentSets - 1);
            router.navigate({
                pathname: "start/rest",
                params: {
                    exercises: exercises.exercises,
                    currentIndex: index,
                    rest: current.rest,
                    currentSet: current.sets - currentSets + 1, // Berechnet die Nummer des aktuellen Satzes
                    //currentSet: 10,
                    totalSets: current.sets, // Gesamtanzahl der Sätze
                }
            });
        } else {
            // Wenn dies der letzte Satz war, führe die Logik aus, um zur nächsten Übung zu wechseln
            if (index + 1 < exercises.exercises.length) {
                const nextIndex = index + 1;
                setIndex(nextIndex);
                setCurrentSets(exercises.exercises[nextIndex].sets); // Setzt die Sätze für die nächste Übung

                // Hier zusätzlich navigieren, um den Rest zwischen Übungen zu handhaben
                router.navigate({
                    pathname: "start/rest",
                    params: {
                        exercises: exercises.exercises,
                        currentIndex: index,
                        //rest: exercises.exercises[nextIndex].rest,
                        rest: current.rest,
                        currentSet: current.sets - currentSets + 1,
                        totalSets: current.sets, // Gesamtanzahl der Sätze
                        //currentSets: 1,
                        //totalSets: exercises.exercises[nextIndex].sets
                        //currentIndex: index + 1,
                        //rest: exercises.exercises[index + 1].rest,
                        //currentSet: 1,
                        //totalSets: exercises.exercises[index + 1].sets,
                    }
                });
            } else {
                router.dismissAll();
            }
        }
    };



    return (

        <View style={styles.container}>
            <CustomHeader title={current.name}/>
            <Text>PAUSE: {current.rest}</Text>
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
            />
        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        content: {
            backgroundColor: colors.secondary,
            flex: 1,
            paddingHorizontal: 20,
            padding: 20,
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
            marginBottom: 10
            //backgroundColor: "red"
        },
        cardStyle: {
            backgroundColor: colors.baseColor,
            width: "30%"
        },
        cardHeader: {
            fontSize: textStyles.footnote,
            color: colors.colorButtonLabel,
            textAlign: "center"
        },
        cardContent: {
            fontSize: textStyles.body,
            fontWeight: "bold",
            color: colors.colorButtonLabel,
            textAlign: "center"
        },
        descriptionContainer: {

        },
        description: {
            fontSize: textStyles.body,
            textAlign: "justify",
        },
        exerciseImage: {
            width: "100%",
            height: 370
        },
        video: {
            //width: windowWidth,
            height: 220,
            marginTop: 0,
        },
        information: {
            textAlign: "justify",
            fontSize: textStyles.body,
            color: colors.label
        },
        additionalInfo: {
            marginTop: 10,
            textAlign: "justify",
            fontSize: textStyles.body,
            color: colors.label
        },
        scrollBox: {
            flex: 1
        },
        bold: {
            fontWeight: "bold",
        }
    })
}

export default Exercises;
