import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Image} from 'expo-image';
import {useAuth} from "../../../../context/AuthContext";
import {useContext, useEffect, useState} from "react";
import {elements, images} from "../../../../constants";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {format} from 'date-fns';
import {de} from 'date-fns/locale';
import {useAppStyle} from "../../../../context/AppStyleContext";
import {dark} from "../../../../constants/colors";
import Card from "../../../../components/Card";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import ExerciseList from "../../../../components/ExerciseList";
import {router} from "expo-router";
import Animated, {FadeInRight} from "react-native-reanimated";
import TodayStats from "../../../../components/TodayStats";
import Avatar from "../../../../components/Avatar";

const Home = () => {
    const {getTextStyles, getColors, fontFamily, colorScheme} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const {user} = useAuth();
    const {workouts} = useContext(WorkoutContext);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");

    useEffect(() => {
        setSelectedWorkoutId(workouts[0]?.id);
        //console.log(selectedWorkoutId);
    }, [workouts]);

    const getCurrentDate = () => {
        const today = new Date();
        return format(today, 'EEEE dd. MMMM', {locale: de});
    };

    const renderWorkout = ({item, index}) => {
        return (
            <Animated.View entering={FadeInRight.delay(100).duration(index * 300)}>
                <Card
                    style={item.id === selectedWorkoutId ? styles.workoutContainerSelected : styles.workoutContainer}
                    onPress={() => setSelectedWorkoutId(item.id)}
                    clickable
                >
                    <Text
                        style={item.id === selectedWorkoutId ? styles.workoutNameSelected : styles.workoutName}>{item.name}</Text>
                </Card>
            </Animated.View>
        )
    }

    const exercises = ({item, index}) => {
        const navigation = () => {
            router.navigate({pathname: "/exerciseDetail/[exerciseId]", params: {exercise: JSON.stringify(item)}})
        }
        return (
            <ExerciseList item={item} index={index} handleNavigation={navigation}/>
        )
    }

    const selectedWorkout = workouts?.find(workout => workout.id === selectedWorkoutId);
    const currentDate = getCurrentDate();


    //fix status bar
    return (
        <>
            <SafeAreaView style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.dateText}>{currentDate}</Text>
                            <Text style={styles.greetingText}>Hallo
                                    <Text style={styles.usernameText}>{" "}{user.username}!</Text>
                            </Text>
                        </View>
                        {/* ImageViewer with TouchableOpacity for the camera button */}
                        <Avatar />
                    </View>

                    <View style={styles.workoutInfoContainer}>
                        <Text style={styles.firstTitleText}>Aktivität</Text>
                    </View>

                    <TodayStats/>

                    <View style={styles.workoutInfoContainer}>
                        <Text style={styles.titleText}>Fitnesspläne</Text>
                    </View>
                    <View>
                        <FlatList
                            data={workouts}
                            renderItem={renderWorkout}
                            keyExtractor={item => item.id}
                            horizontal={true} // Set horizontal to true for horizontal scrolling
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    {selectedWorkoutId !== null && (
                        <View style={styles.exerciseListContainer}>
                            <FlatList
                                data={selectedWorkout?.exercises}
                                renderItem={exercises}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
            <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
        </>
    );
};

export default Home;

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
        },
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start"
        },
        donutChartContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly"
        },
        content: {
            flex: 1,
        },
        boxStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
        },
        boxStyleLarge: {
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            gap: 10
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
        },
        exerciseContainer: {
            flexDirection: "row",
        },
        exercises: {
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
        },
        exerciseImageContainer: {
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