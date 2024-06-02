import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useAuth} from "../../context/AuthProvider";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {getDoc, doc} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import {colors, icons, images} from "../../constants";
import DonutChart from "../../components/DonutChart";
import BigDonutChart from "../../components/BigDonutChart";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {workouts} from "../../data/fitness";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const Home = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const flatListRef = useRef(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(1);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const getCurrentDate = () => {
        const today = new Date();
        return format(today, 'EEEE dd. MMMM', { locale: de });
    };

    const loadUserInfo = async () => {
        const userDocument = await getDoc(doc(FIRESTORE_DB, "users", user.uid));
        console.log("DATA: ",userDocument.data())
        if(userDocument.exists()){
            setUsername(userDocument.data().username);
        }
    }

    //Function to handle selecting a profile image and safe it to asyncStorage
    const handlePressImage = async () => {
        /*let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            await saveProfileImage(result.assets[0].uri);
        } else {
            console.log('Es wurde kein Bild ausgewählt.');
        }*/
        console.log("Image PICKER selected")
    };

    const renderWorkout = ({item}) => {
        return (
            <TouchableOpacity style={item.id === selectedWorkoutId ? styles.workoutContainerSelected : styles.workoutContainer} onPress={()=> setSelectedWorkoutId(item.id)}>
                {/*<Image source={item.image} style={styles.workoutImage} />*/}
                <Text style={item.id === selectedWorkoutId ? styles.workoutNameSelected : styles.workoutName}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const renderExercise = ({item}) => {

        return (
            <View style={styles.exerciseContainer}>
                <View style={styles.exercises}>
                    <View>
                        <Text style={styles.exerciseName} numberOfLines={1} ellipsizeMode={"tail"}>{item.name}</Text>
                    </View>
                    <View>
                        <View style={{flexDirection: "row"}}>
                            <View style={styles.smallIconContainer}>
                                <Image source={icons.rest} style={styles.smallIcon}/>
                            </View>
                            <Text style={styles.exerciseDetails}>Sets: {item.sets}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <View style={styles.smallIconContainer}>
                                <Image source={icons.repeat} style={styles.smallIcon}/>
                            </View>
                            <Text style={styles.exerciseDetails}>Pause: {item.rest} min</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.exerciseImageContainer}>
                    <Image source={item.image} style={styles.exerciseImage} />
                </View>
            </View>
        )
    }

    const selectedWorkout = workouts.find(workout => workout.id === selectedWorkoutId);
    const currentDate = getCurrentDate();

    return (

        <SafeAreaView style={styles.backgroundImage}>
            <StatusBar style={"dark"}/>
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.dateText}>{currentDate}</Text>
                        <Text style={styles.greetingText}>Hallo
                            <Text style={styles.usernameText}>{" "}{username}!</Text>
                        </Text>
                    </View>
                    {/* ImageViewer with TouchableOpacity for the camera button */}
                    <TouchableOpacity onPress={handlePressImage} style={{zIndex: 2}}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={images.avatar}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    resizeMode: "contain",
                                }}
                            />
                            <View style={styles.cameraStyle}>
                                <Image source={icons.camera} style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: colors.buttonBackgroundDefault
                                }}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.workoutInfoContainer}>
                    <Text style={styles.firstTitleText}>Aktivität</Text>
                </View>
               <View style={styles.workoutInfoBox}>
                   {/*<View style={styles.boxStyleLarge}>
                        <BigDonutChart
                            key="minutes"
                            //percentage={lastElapsedTime}
                            color={colors.donutColorDefault}
                            delay={1000}
                            max={240}
                            radius={60}
                        />
                    </View>*/}
                    <View style={styles.donutChartContainer}>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={870}
                                color={colors.donutColorDefault}
                                delay={1000}
                                max={1000}
                            />
                            <Text style={styles.headerCounterLabel}>cal</Text>
                        </View>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={14}
                                color={colors.donutColorDefault}
                                delay={1000}
                                max={20}
                            />
                            <Text style={styles.headerCounterLabel}>übungen</Text>
                        </View>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={120}
                                color={colors.donutColorDefault}
                                delay={1000}
                                max={240}
                            />
                            <Text style={styles.headerCounterLabel}>min</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.workoutInfoContainer}>
                    <Text style={styles.titleText}>Fitnesspläne</Text>
                </View>
                <View>
                    <FlatList
                        ref={flatListRef}
                        data={workouts}
                        renderItem={renderWorkout}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true} // Set horizontal to true for horizontal scrolling
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                {selectedWorkoutId !== null && (
                    <View style={styles.exerciseListContainer}>
                        <FlatList
                            data={selectedWorkout.exercises}
                            renderItem={renderExercise}
                            //keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1
    },
    image: {
        position: "absolute",
        top: 50,
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        tintColor: colors.inactiveColor
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        //flexDirection: "column",
        //justifyContent: "space-evenly"
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    workoutInfoBox: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: colors.boxBackgroundTransparent,
        padding: 10,
        borderRadius: 10
    },
    donutChartContainer: {
        flexDirection: "row",
        gap: 15,
        //alignItems: "flex-end"
    },
    content: {
        flex: 1,
    },
    boxStyle: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end"
        //backgroundColor: colors.white
    },
    boxStyleLarge: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        gap: 10
        //backgroundColor: colors.white
    },
    headerCounterLabel: {
        color: colors.textColorGrey,
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        alignSelf: "center"
    },
    workoutInfoContainer: {
        alignItems:"flex-start",
        paddingBottom: 5,
        //marginTop: 10
        marginBottom: 5
    },
    firstTitleText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 20,
    },
    titleText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 20,
        marginTop: 15
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
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        color: colors.textColorGrey
    },
    greetingText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 20
    },
    usernameText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 25,
        color: colors.textColorDefault
    },
    workoutContainer: {
        padding: 10,
        backgroundColor: colors.boxBackgroundTransparent,
        borderRadius: 30,
        alignItems: "center",
        marginRight: 10,
        marginBottom: 10
    },
    workoutContainerSelected: {
        padding: 10,
        backgroundColor: colors.buttonBackgroundDefault,
        borderRadius: 30,
        alignItems: "center",
        marginRight: 10,
        marginBottom: 10
    },
    workoutImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        tintColor: colors.buttonBackgroundDefault
    },
    workoutName: {
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        marginVertical: 5
    },
    workoutNameSelected: {
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        marginVertical: 5,
        color: colors.white
    },
    exerciseListContainer: {
        flex: 1,
        marginTop: 5,
        //marginBottom: 5
    },
    exerciseContainer: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: colors.boxBackgroundTransparent,
        marginBottom: 10,
        //alignItems: "flex-end"
        justifyContent: "space-between"
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
    exerciseImageContainer: {
        //backgroundColor: "red"
    },
    exerciseImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    exerciseName: {
        fontFamily: "Poppins-SemiBold",
        color: colors.textColorDefault,
        fontSize: 16,
        paddingLeft: 5,
        width: "100%",
    },
    exerciseDetails: {
        fontFamily: "Poppins-Regular",
        color: colors.textColorGrey,
        fontSize: 14,
        paddingLeft: 5,
        paddingTop: 2,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    smallIconContainer: {
        backgroundColor: colors.donutColorDefaultTransparent,
        borderRadius: 5,
        marginBottom: 5,
        padding: 5,
    },
    smallIcon: {
        width: 15,
        height: 15,
        tintColor: colors.donutColorDefault,
    }
})