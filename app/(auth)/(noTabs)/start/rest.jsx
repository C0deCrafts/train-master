import {Text, View, StyleSheet, Image, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {useLocalSearchParams, router} from "expo-router";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {icons, images} from "../../../../constants";
import {SafeAreaView} from "react-native-safe-area-context";
import Animated, {FadeInDown, FadeInRight} from "react-native-reanimated";

//fix small screens - no responsive design jet
//buttons müssen noch ersetzt werden

const Rest = () => {
    const { exercise, currentIndex, rest, currentSet, totalSets } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const [timeLeft, setTimeLeft] = useState(rest);
    const exercises = exercise ? JSON.parse(exercise) : {};

    useEffect(() => {
        // Nur einen Timer starten, wenn timeLeft größer als 0 ist.
        if (timeLeft >= 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            // Cleanup-Funktion, um den Timer zu bereinigen
            return () => clearTimeout(timerId);
        } else {
            router.back();
        }
    }, [timeLeft]);

    /*useEffect(() => {
        console.log(`Aktueller Satz: ${currentSet}, Gesamtsätze: ${totalSets}`);
    }, [currentSet, totalSets]);*/

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <Image
                    style={styles.image}
                    source={images.sportImage}
                />
            </View>

            <View>
                <Text style={styles.text}>Pause</Text>
                <Text style={styles.timer}>{timeLeft}</Text>
                <Text style={styles.textSets}>Satz: {currentSet} von {totalSets} fertig</Text>
            </View>

            {currentSet === totalSets && (
                <Animated.View
                    entering={FadeInRight.delay(200).duration(300)}
                    style={styles.lastBox}>
                    <Text
                        style={styles.lastSet}>Zeit zu glänzen! Letzter Satz!</Text>
                    <Image
                        style={styles.icon}
                        source={icons.celebration}
                    />
                </Animated.View>
            )}

            <View style={styles.buttonBox}>
                <TouchableOpacity style={styles.button} onPress={
                    //handleEndRest

                    () => router.back()}
                >
                    <Text style={styles.buttonLabel}>Pause beenden</Text>
                </TouchableOpacity>

                {currentSet === totalSets && timeLeft > 0 &&(
                    <TouchableOpacity style={styles.button} onPress={() => router.navigate({
                        //nächste übung
                        pathname: "(noTabs)/start/prevExercise",
                        params: {
                            exercise: JSON.stringify(exercises),
                            currentIndex: currentIndex,
                            timeLeft: timeLeft,
                        }
                    })}>
                        <Text style={styles.buttonLabel}>Vorschau der nächsten Übung</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    )
}

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.baseColor,
            justifyContent: "space-between"
        },
        containerHeader: {
            backgroundColor: colors.baseColor,
        },
        image: {
            width: "100%",
            height: 270,
            tintColor: colors.colorButtonLabel,
            marginTop: 20
        },
        icon: {
            width: 30,
            height: 30,
            tintColor: colors.colorButtonLabel
        },
        text: {
            color: colors.colorButtonLabel,
            fontSize: textStyles.largeTitle + 13,
            fontFamily: fontFamily.Poppins_SemiBold,
            textAlign: "center",
        },
        timer: {
            color: colors.colorButtonLabel,
            fontSize: textStyles.largeTitle + 40,
            fontFamily: fontFamily.Poppins_ExtraBold,
            textAlign: "center",
        },
        textSets: {
            marginTop: 20,
            color: colors.colorButtonLabel,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.title_3,
            textAlign: "center",
        },
        buttonBox: {
            marginTop: 40,
        },
        button: {
            backgroundColor: colors.baseColor,
            borderStyle: "solid",
            borderWidth: 3,
            borderColor: colors.colorButtonLabel,
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginHorizontal: 15,
            marginBottom: 10
        },
        buttonLabel: {
            fontSize: textStyles.headline,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.colorButtonLabel,
            textAlign: "center",
            textTransform: "uppercase"
        },
        lastSet: {
            textAlign: "center",
            color: colors.colorButtonLabel,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_3,
            marginRight: 10,
        },
        lastBox: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
    });
};

export default Rest;
