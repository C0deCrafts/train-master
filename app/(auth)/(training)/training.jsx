import {FlatList, StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native'
import {useAppStyle} from "../../../context/AppStyleContext";
import {useContext, useEffect, useState} from "react";
import Card from "../../../components/Card";
import {WorkoutContext} from "../../../context/WorkoutContext";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomHeader from "../../../components/CustomHeader";
import {elements, icons, images} from "../../../constants";
import CustomButton from "../../../components/CustomButton";

const Training = () => {
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
    const {getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme} = useAppStyle();
    const {workouts} = useContext(WorkoutContext);
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const calculateTotalDuration = (workout) => {
        const totalDurationInSeconds = workout.exercises.reduce((total, exercise) => {
            const duration = exercise.duration || 0; // Default to 0 if duration is not set
            return total + duration;
        }, 0);

        const minutes = Math.ceil(totalDurationInSeconds / 60);
        return minutes;
    };

    const renderWorkout = ({item}) => {
        const totalDuration = calculateTotalDuration(item);
        const imageUrl = item.image || '';

        return (
            <Card
                style={styles.workout}
                href={{pathname: `/(training)/${item.id}/exercises`, params: {item: JSON.stringify(item), workoutId: item.id}}}
                clickable
            >
                {imageUrl && (
                    <Image
                        source={{uri: item.image}}
                        style={{
                            width: "100%",
                            height: 100,
                            borderTopLeftRadius: elements.cardRadius,
                            borderTopRightRadius: elements.cardRadius,
                        }}
                    />
                )}
                {/*<Image source={item.image} style={styles.workoutImage} />*/}
                <View style={styles.cardContent}>
                    <View style={styles.cardContainerTitleDescription}>
                        <View>
                            <Text style={[styles.cardTitle, styles.maxWith]}
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                            >{item.name}</Text>
                            <Text style={[styles.cardDescription, styles.maxWith]}
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                            >
                                {item.description}
                            </Text>
                        </View>
                        <View>
                            <Image style={styles.icon} source={icons.forward}/>
                        </View>
                    </View>
                    <View style={styles.cardContainerDetails}>
                        <Image source={icons.time} style={styles.smallIcon}/>
                        <Text style={styles.cardDescription}>{totalDuration} Min</Text>
                        <Text style={styles.cardDescription}> ● {item.exercises.length} Übungen</Text>
                    </View>
                </View>
            </Card>
        )
    }


    return (
        <View style={styles.container}>
            <CustomHeader title={"Training"}/>
            <View style={styles.content}>
                <Text style={styles.titleText}>Fitnesspläne</Text>
                <View style={styles.workoutContainer}>
                    <FlatList
                        data={workouts}
                        renderItem={renderWorkout}
                        keyExtractor={item => item.id}
                        horizontal={true} // Set horizontal to true for horizontal scrolling
                        showsHorizontalScrollIndicator={false}
                        //style={{backgroundColor: "red"}}
                    />
                </View>
            </View>
            {/*<CustomButton title={"Id anzeigen"} handlePress={fetchExercises}/>
            <CustomButton title={"Workouts anzeigen"} handlePress={fetchWorkoutsWithExercises}/>*/}

        </View>
    );
};

export default Training;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        content: {
            paddingHorizontal: 20,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        titleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            marginTop: 15,
            color: colors.label
        },
        workoutContainer: {
            //backgroundColor: colors.secondary,
            //borderRadius: elements.cardRadius,
        },
        workout: {
            backgroundColor: colors.secondary,
            //fix color
            marginRight: 10,
            marginTop: 10,
            padding: 0,
            borderRadius: elements.cardRadius,
        },
        cardContent: {
            width: 200,
            height: 120,
            paddingLeft: 10,
            paddingVertical: 10,
            flexDirection: "column",
            justifyContent: "space-between"
        },
        cardContainerTitleDescription: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        cardContainerDetails: {
            flexDirection: "row",
            marginRight: 10,
        },
        cardTitle: {
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            fontSize: textStyles.subhead,
        },
        maxWith: {
            width: 150
        },
        cardDescription: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.secondaryLabel,
            fontSize: textStyles.footnote,
        },
        icon: {
            width: 30,
            height: 30,
            tintColor: colors.baseColor,
            //backgroundColor: "red"
        },
        smallIcon: {
            width: 15,
            height: 15,
            tintColor: colors.baseColor,
            marginRight: 5,
        }
    })
}