import {Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity} from "react-native";
import {useEffect, useState} from "react";
import {useLocalSearchParams, router} from "expo-router";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {icons, images} from "../../../../constants";

const Rest = () => {
    const { exercises, currentIndex, rest, currentSet, totalSets } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [timeLeft, setTimeLeft] = useState(rest);

    useEffect(() => {
        //console.log("currentIndex: ", currentIndex) //0
        //console.log("rest: ", rest) //60
       // console.log("currentSet: ", currentSet) //1
        //console.log("totalSets: ", totalSets) //2
    }, [currentIndex, rest]);

    useEffect(() => {
        // Nur einen Timer starten, wenn timeLeft größer als 0 ist.
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            // Cleanup-Funktion, um den Timer zu bereinigen
            return () => clearTimeout(timerId);
        } else {
            router.back();
            //handleEndRest();
        }
    }, [timeLeft]);

    useEffect(() => {
        console.log(`Aktueller Satz: ${currentSet}, Gesamtsätze: ${totalSets}`);
    }, [currentSet, totalSets]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <Image
                    style={styles.image}
                    source={images.sportImage}
                />
            </View>

            <Text style={styles.text}>Pause</Text>
            <Text style={styles.timer}>{timeLeft}</Text>
            <Text style={styles.textSets}>Satz: {currentSet} von {totalSets} fertig</Text>

            {currentSet === totalSets && (
                <View style={styles.lastBox}>
                    <Text style={styles.lastSet}>Zeit zu glänzen! Letzter Satz!</Text>
                    <Image
                        style={styles.icon}
                        source={icons.celebration}
                    />
                </View>
            )}

            <View style={styles.buttonBox}>
                <TouchableOpacity style={styles.button} onPress={
                    //handleEndRest
                    () => router.back()}
                >
                    <Text style={styles.buttonLabel}>Pause beenden</Text>
                </TouchableOpacity>

                {currentSet === totalSets && (
                    <TouchableOpacity style={styles.button} onPress={() => router.navigate({
                        //nächste übung
                        pathname: "start/prevExercise",
                        params: {
                            exercises: exercises,
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
        },
        containerHeader: {
            backgroundColor: colors.baseColor,
        },
        image: {
            width: "100%",
            height: 300,
            tintColor: colors.colorButtonLabel
        },
        icon: {
            width: 30,
            height: 30,
            tintColor: colors.colorButtonLabel
        },
        text: {
            color: colors.colorButtonLabel,
            fontSize: 50,
            fontWeight: "600",
            textAlign: "center",
        },
        timer: {
            color: colors.colorButtonLabel,
            fontSize: 80,
            fontWeight: "800",
            textAlign: "center",
        },
        textSets: {
            marginTop: 20,
            color: colors.colorButtonLabel,
            fontSize: 20,
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
            marginBottom: 20
        },
        buttonLabel: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.colorButtonLabel,
            textAlign: "center",
            textTransform: "uppercase"
        },
        lastSet: {
            textAlign: "center",
            color: colors.colorButtonLabel,
            fontSize: 20,
            marginRight: 10,
            marginTop: 5
        },
        lastBox: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
    });
};

export default Rest;
