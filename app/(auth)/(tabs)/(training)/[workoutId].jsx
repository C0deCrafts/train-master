import {View, StyleSheet, FlatList} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {router, useLocalSearchParams} from "expo-router";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {elements} from "../../../../constants";
import {useContext, useEffect} from "react";
import CustomButton from "../../../../components/CustomButton";
import ExerciseList from "../../../../components/ExerciseList";


const WorkoutId = () => {
    const { workout, item } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const workoutItem = item ? JSON.parse(item) : {};

    useEffect(() => {
        console.log("Workout: ", workout)
        console.log("Workout: ", typeof workoutItem)
    }, []);

    const handleStartWorkout = () => {
        //console.log("Start workout: ", JSON.stringify(item))
        router.push({ pathname: '/start/exercises', params: { exercise: JSON.stringify(workoutItem) } });
    }

    const exercises = ({item}) => {
        const handleNavigation = () => {
            router.navigate({pathname: "/exercise/[exerciseId]", params: {exercise: JSON.stringify(item)}})
        }
        return (
            <ExerciseList item={item} handleNavigation={handleNavigation}/>
        )
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={workoutItem.name} backButtonVisible={true}/>
            <View style={styles.exerciseListContainer}>
                <FlatList
                    data={workoutItem.exercises}
                    renderItem={exercises}
                    //keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <CustomButton title={"Workout starten"} handlePress={handleStartWorkout} containerStyles={styles.button}/>
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
            paddingHorizontal: 10
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