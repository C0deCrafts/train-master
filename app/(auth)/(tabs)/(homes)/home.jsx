import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Image} from 'expo-image';
import {useAuth} from "../../../../context/AuthContext";
import {useContext, useEffect, useState} from "react";
import {images} from "../../../../constants";
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
import {appStyles} from "../../../../constants/elementStyles";
import * as Notifications from "expo-notifications";

const Home = () => {
    const {getTextStyles, getColors, fontFamily, colorScheme, safeAreaTop, bottomTabSpacing} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily, safeAreaTop, bottomTabSpacing);

    const {user} = useAuth();
    const {workouts} = useContext(WorkoutContext);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");

    //const notificationListener = useRef();
    //const responseListener = useRef();

    //später evtl ein Begrüßungsbildschirm und dann nach Erlaubnis für Notifications fragen
    useEffect(() => {
        Notifications.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: false,
            }
        }).then((status)=> {
            console.log("Permission (in Home): ", status);
        })

        /*// Received notification while app is in foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
            console.log("NOTIF: ", notification);
        })

        // Tab on notification to open app
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response)=>{
            console.log("RESPONSE: ", response);
        })*/
    }, []);

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
            <View style={styles.backgroundImage}>
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

                    <View>
                        <Text style={styles.titleText}>Aktivität</Text>
                    </View>

                    <TodayStats/>

                    <View style={styles.spacing}>
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
                        <View style={{flex: 1}}>
                            <FlatList
                                data={selectedWorkout?.exercises}
                                renderItem={exercises}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}
                </View>
            </View>
            <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
        </>
    );
};

export default Home;

const createStyles = (textStyles, colors, fontFamily, safeAreaTop, bottomTabSpacing) => {
    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingTop: safeAreaTop,
            paddingBottom: bottomTabSpacing
        },
        image: {
            position: "absolute",
            top: appStyles.backgroundImagePositionTopNoHeader,
            width: "100%",
            height: "100%",
            tintColor: colors.quaternaryLabel,
            pointerEvents: "none"
        },
        container: {
            flex: 1,
            paddingHorizontal: appStyles.spacingHorizontalDefault,
            paddingTop: appStyles.extraSpacingSmall,
        },
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        titleText: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            color: colors.label
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
            borderRadius: appStyles.cardRadiusLarge,
            marginRight: appStyles.spacingHorizontalSmall,
            marginTop: appStyles.spacingHorizontalExtraSmall,
            marginBottom: appStyles.extraSpacingDefault,
        },
        workoutContainerSelected: {
            backgroundColor: colors.baseColor,
            borderRadius: appStyles.cardRadiusLarge,
            marginRight: appStyles.spacingHorizontalSmall,
            marginTop: appStyles.spacingHorizontalExtraSmall,
            marginBottom: appStyles.extraSpacingDefault,
        },
        workoutName: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: appStyles.extraSpacingExtraSmall,
            color: colors.label
        },
        workoutNameSelected: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: appStyles.extraSpacingExtraSmall,
            color: colors.colorButtonLabel
        },
        spacing: {
            marginVertical: appStyles.extraSpacingExtraSmall
        }
    })
}