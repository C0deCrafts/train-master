import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useAuth} from "../../context/AuthProvider";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import FormField from "../../components/FormField";
import {colors, icons, images} from "../../constants";
import DonutChart from "../../components/DonutChart";
import BigDonutChart from "../../components/BigDonutChart";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import {workouts} from "../../data/fitness";
import Spinner from "react-native-loading-spinner-overlay";

const Home = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const flatListRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(workouts)
    const [isListEnd, setIsListEnd] = useState(false)
    const [offset, setOffset] = useState(1)
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

    useEffect(() => {
        loadUserInfo();
    }, []);

    const getData = () => {
        console.log("Offset: ", offset);
        if(!loading && !isListEnd){
            console.log("GET DATA")
            setLoading(true);
            if(workouts.length > 0){
                setOffset(offset+1);
                setDataSource([...dataSource, ...workouts]);
                setLoading(false);
            } else {
                setIsListEnd(true)
                setLoading(false);
            }
        }
    }

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
            <TouchableOpacity style={styles.workoutContainer} onPress={()=> console.log("Item")}>
                <Spinner visible={loading}/>
                <Image source={item.image} style={styles.workoutImage} />
                <Text style={styles.workoutName}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const renderExercises = ({item}) => {
        return (
            <View style={styles.exerciseContainer}>
                <Image source={item.image} style={styles.exerciseImage} />
                <Text style={styles.exerciseName}>{item.name}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.backgroundImage}>
            <StatusBar style={"dark"}/>
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    {/* ImageViewer with TouchableOpacity for the camera button */}
                    <TouchableOpacity onPress={handlePressImage} style={{zIndex: 2}}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={images.avatar}
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: 70,
                                    resizeMode: "contain",
                                }}
                            />
                            <View style={styles.cameraStyle}>
                                <Image source={icons.camera} style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: colors.buttonBackgroundDefault
                                }}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.greetingText}>Hallo</Text>
                        <Text style={styles.usernameText}>{username}!</Text>
                    </View>
                </View>

                <View style={styles.workoutInfoContainer}>
                    <Text style={styles.titleText}>Aktivität</Text>
                </View>
                <View style={styles.workoutInfoBox}>
                    <View style={styles.boxStyle}>
                        <BigDonutChart
                            key="minutes"
                            //percentage={lastElapsedTime}
                            color={colors.donutColorDefault}
                            delay={1000}
                            max={240}
                            radius={80}
                        />
                    </View>
                    <View style={styles.donutChartContainer}>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={25}
                                color={colors.donutColorDefault}
                                delay={1000}
                                max={240}
                            />
                            <Text style={styles.headerCounterLabel}>kcal</Text>
                        </View>
                        <View style={styles.boxStyle}>
                            <DonutChart
                                key="minutes"
                                //percentage={lastElapsedTime}
                                percentage={80}
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
                        data={dataSource}
                        renderItem={renderWorkout}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true} // Set horizontal to true for horizontal scrolling
                        onEndReached={getData} // Load more data when the end is reached
                        onEndReachedThreshold={0.5} // Trigger onEndReached when halfway through the content
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

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
        justifyContent: "space-evenly"
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "flex-end"
    },
    workoutInfoBox: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: colors.boxBackgroundTransparent,
        padding: 10,
        borderRadius: 10
    },
    donutChartContainer: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-end"
    },
    content: {
        flex: 1,
    },
    boxStyle: {
        flexDirection: "row",
        alignItems: "flex-end"
        //backgroundColor: colors.white
    },
    headerCounterLabel: {
        color: colors.textColorGrey,
        fontFamily: "Poppins-Regular",
        fontSize: 16,
    },
    workoutInfoContainer: {
        alignItems:"flex-start",
        paddingBottom: 5
    },
    titleText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 25
    },
    imageContainer: {
        alignItems: "flex-start",
    },
    cameraStyle: {
        flex: 1,
        justifyContent: "flex-end",
        top: 5,
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
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10
    },
    workoutImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        tintColor: colors.buttonBackgroundDefault
    },
    workoutName: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 16,
        marginVertical: 10
    },

})