import Card from "./Card";
import {StyleSheet, Text, View} from "react-native";
import { Image } from 'expo-image';
import {elements, icons} from "../constants";
import {useContext} from "react";
import {WorkoutContext} from "../context/WorkoutContext";
import {useAppStyle} from "../context/AppStyleContext";
import Animated, {FadeInDown} from "react-native-reanimated";
import {appStyles} from "../constants/elementStyles";

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
            //style={{marginBottom: 10}}
        >
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
                                <View style={styles.exerciseDetailsContainer}>
                                    <View style={styles.smallIconContainer}>
                                        <Image source={icons.repeat} style={styles.smallIcon}/>
                                    </View>
                                    <View>
                                        <Text style={styles.exerciseDetails}>Sätze: {item.sets}</Text>
                                    </View>
                                </View>
                            )}
                            {item.repetitions && (
                                <View style={styles.exerciseDetailsContainer}>
                                    <View style={styles.smallIconContainer}>
                                        <Image source={icons.repeat} style={styles.smallIcon}/>
                                    </View>
                                    <View>
                                        <Text style={styles.exerciseDetails}>Wiederholungen: {item.repetitions}</Text>
                                    </View>
                                </View>
                            )}
                            {item.heartRateZone && (
                                <View style={styles.exerciseDetailsContainer}>
                                    <View style={styles.smallIconContainer}>
                                        <Image source={icons.heartbeat} style={styles.smallIcon}/>
                                    </View>
                                    <View>
                                        <Text style={styles.exerciseDetails}>Herzrate: {item.heartRateZone}</Text>
                                    </View>
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
        exerciseContainer: {
            flexDirection: "row",
            height: 100
        },
        exercises: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
        },
        exerciseName: {
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            fontSize: textStyles.callout,
            width: "95%",
            paddingLeft: appStyles.cardTitleSpacingLeft,
        },
        exerciseDetails: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.secondaryLabel,
            fontSize: textStyles.footnote,
            paddingLeft: appStyles.extraSpacingExtraSmall,
        },
        exerciseDetailsContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        exerciseImage: {
            width: 100,
            height: 100,
            borderRadius: elements.imageRadius,
        },
        smallIconContainer: {
            backgroundColor: colors.baseColor,
            borderRadius: elements.iconRadius,
            marginTop: appStyles.extraSpacingExtraSmall,
            padding: appStyles.spacingAroundExtraSmall,
        },
        smallIcon: {
            width: appStyles.smallIcon,
            height: appStyles.smallIcon,
            tintColor: colors.colorButtonLabel,
        }
    })
}
