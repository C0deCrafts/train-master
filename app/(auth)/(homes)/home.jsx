import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useAuth} from "../../../context/AuthProvider";
import {FIRESTORE_DB} from "../../../config/firebaseConfig";
import {getDoc, doc} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import {colors, elements, icons, images} from "../../../constants";
import DonutChart from "../../../components/DonutChart";
import BigDonutChart from "../../../components/BigDonutChart";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {workouts} from "../../../data/fitness";
import {format} from 'date-fns';
import {de} from 'date-fns/locale';
import {useAppStyle} from "../../../context/AppStyleContext";
import {dark, light} from "../../../constants/colors";
import Card from "../../../components/Card";

const Home = () => {
    const {getTextStyles, getColors, fontFamily, colorScheme} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const {user, username} = useAuth();
    //const [username, setUsername] = useState("");
    const flatListRef = useRef(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(1);

    const getCurrentDate = () => {
        const today = new Date();
        return format(today, 'EEEE dd. MMMM', {locale: de});
    };


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
            <Card
                style={item.id === selectedWorkoutId ? styles.workoutContainerSelected : styles.workoutContainer}
                onPress={() => setSelectedWorkoutId(item.id)}
                clickable
            >
                {/*<Image source={item.image} style={styles.workoutImage} />*/}
                <Text
                    style={item.id === selectedWorkoutId ? styles.workoutNameSelected : styles.workoutName}>{item.name}</Text>
            </Card>
        )
    }

    const renderExercise = ({item}) => {

        return (
            <Card
                  style={{marginBottom: 10}}
                  //onPress={()=> console.log(item)}
                  href={{pathname: `/(homes)/${item.id}`, params: {item: JSON.stringify(item)}}}
                  clickable
            ><View style={styles.exerciseContainer}>
                <View style={styles.exercises}>
                    <View>
                        <Text style={styles.exerciseName} numberOfLines={1} ellipsizeMode={"tail"}>{item.name}</Text>
                    </View>
                    <View>
                        {item.sets && (
                            <View style={{flexDirection: "row"}}>
                                <View style={styles.smallIconContainer}>
                                    <Image source={icons.repeat} style={styles.smallIcon}/>
                                </View>
                                <Text style={styles.exerciseDetails}>Sets: {item.sets}</Text>
                            </View>
                        )}
                        {item.rest && (
                            <View style={{flexDirection: "row"}}>
                                <View style={styles.smallIconContainer}>
                                    <Image source={icons.rest} style={styles.smallIcon}/>
                                </View>
                                <Text style={styles.exerciseDetails}>Pause: {item.rest} min</Text>
                            </View>
                        )}
                        {item.duration && (
                            <View style={{flexDirection: "row"}}>
                                <View style={styles.smallIconContainer}>
                                    <Image source={icons.time} style={styles.smallIcon}/>
                                </View>
                                <Text style={styles.exerciseDetails}>Dauer: {item.duration}</Text>
                            </View>
                        )}
                        {item.heartRateZone && (
                            <View style={{flexDirection: "row"}}>
                                <View style={styles.smallIconContainer}>
                                    <Image source={icons.heartbeat} style={styles.smallIcon}/>
                                </View>
                                <Text style={styles.exerciseDetails}>Herzrate: {item.heartRateZone}</Text>
                            </View>
                        )}
                    </View>
                </View>
                {item.image && (
                    <View style={styles.exerciseImageContainer}>
                        <Image source={item.image} style={styles.exerciseImage}/>
                    </View>
                )}
            </View>
            </Card>
        )
    }

    const selectedWorkout = workouts.find(workout => workout.id === selectedWorkoutId);
    const currentDate = getCurrentDate();

    //fix status bar
    return (
        <SafeAreaView style={styles.backgroundImage}>
            <StatusBar style={"dark"}/>
            {/*colors.label*/}
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
                                    tintColor: colors.label
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
                                percentage={14}
                                color={colors.baseColor}
                                delay={1000}
                                max={20}
                            />
                            <Text style={styles.headerCounterLabel}>Übungen</Text>
                        </View>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={870}
                                color={colors.baseColor}
                                delay={1000}
                                max={1000}
                            />
                            <Text style={styles.headerCounterLabel}>Kcal</Text>
                        </View>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={120}
                                color={colors.baseColor}
                                delay={1000}
                                max={240}
                            />
                            <Text style={styles.headerCounterLabel}>Minuten</Text>
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
            resizeMode: "contain",
            tintColor: colors.quaternaryLabel
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
            //flexDirection: "row",
            //justifyContent: "space-between",
            //backgroundColor: colors.boxBackgroundTransparent,
            //padding: 10,
            //borderRadius: 10
        },
        donutChartContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly"
            //gap: 15,
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
            color: colors.label,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            alignSelf: "center"
        },
        workoutInfoContainer: {
            alignItems: "flex-start",
            paddingBottom: 5,
            //marginTop: 10
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
            //marginBottom: 5
        },
        exerciseContainer: {
            flexDirection: "row",
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