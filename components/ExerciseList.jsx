import Card from "./Card";
import {StyleSheet, Text, View} from "react-native";
import { Image } from 'expo-image';
import {elements, icons} from "../constants";
import {useContext} from "react";
import {WorkoutContext} from "../context/WorkoutContext";
import {useAppStyle} from "../context/AppStyleContext";
import Animated, {FadeInDown} from "react-native-reanimated";

const ExerciseList = ({item, index, handleNavigation }) => {
    const { exerciseImages } = useContext(WorkoutContext);
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);
    const imageUrl = exerciseImages[item.id] || ""

    //console.log("ImageURL: ", imageUrl)

    return (
        <Animated.View
            entering={FadeInDown.delay(200).duration(index * 300)}
            style={{marginBottom: 10}}>
            <Card
                //style={{marginBottom: 10}}
                onPress={handleNavigation}
                clickable
            >
                <View style={styles.exerciseContainer}>
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
                                    <Text style={styles.exerciseDetails}>Sätze: {item.sets}</Text>
                                </View>
                            )}
                            {item.repetitions && (
                                <View style={{flexDirection: "row"}}>
                                    <View style={styles.smallIconContainer}>
                                        <Image source={icons.repeat} style={styles.smallIcon}/>
                                    </View>
                                    <Text style={styles.exerciseDetails}>Wiederholungen: {item.repetitions}</Text>
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
                    {imageUrl && (
                        <View style={styles.exerciseImageContainer}>
                            <Image source={{ uri: imageUrl }} style={styles.exerciseImage} cachePolicy="memory-disk" />
                        </View>
                    )}
                </View>
            </Card>
        </Animated.View>
    )
};

export default ExerciseList;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        exercises: {
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
        },
        exerciseContainer: {
            flexDirection: "row",
        },
        exerciseName: {
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            fontSize: textStyles.callout,
            paddingLeft: 5,
            paddingBottom: 15,
            width: "95%",
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
        exerciseImageContainer: {},
        exerciseImage: {
            width: 100,
            height: 100,
            borderRadius: elements.imageRadius,
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
