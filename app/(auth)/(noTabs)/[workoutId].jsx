import {View, StyleSheet, FlatList, Text} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {elements} from "../../../constants";
import {useContext, useEffect} from "react";
import {useAppStyle} from "../../../context/AppStyleContext";
import ExerciseList from "../../../components/ExerciseList";
import CustomHeader from "../../../components/CustomHeader";
import CustomButton from "../../../components/CustomButton";
import {SafeAreaView} from "react-native-safe-area-context";
import {WorkoutContext} from "../../../context/WorkoutContext";

const WorkoutId = () => {
    const { workout, item } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const workoutItem = item ? JSON.parse(item) : {};

    const { startSession, completeCurrentExercise, loadWorkouts, workouts } = useContext(WorkoutContext);


    const handleStartWorkout = async () => {
        //console.log("Start workout: ", JSON.stringify(item))
        await startSession(workout);
        router.dismissAll();
        router.replace({ pathname: '(noTabs)/start/exercises', params: { exercise: JSON.stringify(workoutItem) } });
    }

    useEffect(() => {
        console.log("WorkoutID: ", workout)
    }, [workout]);

    const exercises = ({item, index}) => {
        const handleNavigation = () => {
            router.navigate({pathname: "(noTabs)/exercise/[exerciseId]", params: {exercise: JSON.stringify(item)}})
        }
        return (
            <ExerciseList item={item} index={index} handleNavigation={handleNavigation}/>
        )
    }

    return (
        <>
            <CustomHeader title={workoutItem.name} backButtonVisible={true}/>
            <SafeAreaView style={styles.container}>
                <View style={styles.exerciseListContainer}>
                    <FlatList
                        data={workoutItem.exercises}
                        renderItem={exercises}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <CustomButton title={"Workout starten"} handlePress={handleStartWorkout} containerStyles={styles.button}/>
            </SafeAreaView>
        </>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            //backgroundColor: "blue",
            backgroundColor: colors.primary,
            paddingTop: -60
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
        description: {
            fontSize: textStyles.body,
            textAlign: "justify",
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
        exerciseContainer: {
            flexDirection: "row",
            //backgroundColor: "green"
        },
        exerciseListContainer: {
            flex: 1,
            marginTop: 10,
            marginBottom: 10,
            paddingHorizontal: 10,
            //backgroundColor: "green"
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
        },
        exerciseImageContainer: {
            //backgroundColor: "red"
        },
        exerciseImage: {
            width: 100,
            height: 100,
            borderRadius: elements.imageRadius,
        },
        button: {
            backgroundColor: colors.baseColor,
            marginBottom: 10,
            marginHorizontal: 10
        }
    })
}

export default WorkoutId;