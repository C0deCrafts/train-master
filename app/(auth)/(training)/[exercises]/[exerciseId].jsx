/*import { View, Text, Button } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomHeader from "../../../../components/CustomHeader";
import {useEffect} from "react";

const Exercise = () => {
    const { id, exercise } = useLocalSearchParams();
    const exerciseItem = exercise ? JSON.parse(exercise) : {};

    useEffect(() => {
        console.log("EX ITEM: ", exerciseItem.name)
    }, [exerciseItem]);

    return (
        <View>
            <CustomHeader title={exerciseItem.name} backButtonVisible/>
            <Text>Exercise Detail Screen for Workout ID: {exerciseItem.name} and Exercise ID: {exercise.id}</Text>
        </View>
    );
}

export default Exercise;*/
import {
    Image, ScrollView,
    StyleSheet,
    Text, View
} from 'react-native'
import {Link, useLocalSearchParams} from "expo-router";
import {Video} from "expo-av";
import {useAppStyle} from "../../../../context/AppStyleContext";
import CustomHeader from "../../../../components/CustomHeader";
import Card from "../../../../components/Card";
import {useContext, useEffect} from "react";
import {WorkoutContext} from "../../../../context/WorkoutContext";

const Exercises = () => {
    const { id, exercise, isHomeScreen } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const { exerciseVideos } = useContext(WorkoutContext);

    const styles = createStyles(textStyles, colors, fontFamily);
    const exerciseItem = exercise ? JSON.parse(exercise) : {};
    const videoUrl = exerciseVideos[exerciseItem.id] || ""

    //console.log("Homescreen? ", isHomeScreen);
    //console.log("Type of isHomeScreen: ", typeof isHomeScreen);

    return (

        <View style={styles.container}>
            <CustomHeader title={exerciseItem.name} backButtonVisible={true} backToAnotherScreen={isHomeScreen === "true" ? true : false}/>
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
                    {exerciseItem.sets && (
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardHeader}>Sätze</Text>
                            <Text style={styles.cardContent}>x{exerciseItem.sets}</Text>
                        </Card>
                    )}
                    {exerciseItem.repetitions && (
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardHeader}>WH</Text>
                            <Text style={styles.cardContent}>x{exerciseItem.repetitions}</Text>
                        </Card>
                    )}
                    {exerciseItem.weight && (
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardHeader}>Gewicht</Text>
                            <Text style={styles.cardContent}>x{exerciseItem.weight}</Text>
                        </Card>
                    )}
                </View>
                <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
                    <Text style={styles.information}><Text style={styles.bold}>Infos:</Text> {exerciseItem.description}</Text>
                    {exerciseItem.additionalInfo && (
                        <Text style={styles.additionalInfo}><Text style={styles.bold}>Zusatzinfos:</Text> {exerciseItem.additionalInfo}</Text>
                    )}
                    {exerciseItem.heartRateZone && (
                        <Text style={styles.additionalInfo}><Text style={styles.bold}>Heart Rate:</Text> {exerciseItem.heartRateZone}</Text>
                    )}
                </ScrollView>
            </View>
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
