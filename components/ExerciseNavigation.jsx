import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from "expo-image";
import {elements, icons} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {router} from "expo-router";

const ExerciseNavigation = ({ index, exercises, handleCompleteSet, setIndex, currentSet, updateCurrentSets }) => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const handlePrevious = () => {
        if (index > 0) {
            setIndex(index - 1);
            updateCurrentSets(index - 1);
        }
    };

    const handleNext = () => {
        if (index + 1 < exercises.length) {
            setIndex(index + 1);
            updateCurrentSets(index + 1);
        }
    };

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.buttonSmall}
                disabled={index === 0} // Deaktiviert den Button, wenn am ersten Index
                onPress={handlePrevious
                    /*() => {
                    setTimeout(() => {
                        setIndex(index - 1);
                    }, 10);
                }*/
                }
            >
                <Image source={icons.fastRewind} style={styles.buttonIcon} />
            </TouchableOpacity>

            {index + 1 >= exercises.length && currentSet === 1 ? (
                <TouchableOpacity
                    style={styles.buttonDone}
                    onPress={() => {

                        //Route nach allerletzter Übung
                        router.replace("(tabs)/(training)/training")
                    }}>
                    <Text style={styles.buttonStartLabel}>Erledigt</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.buttonDone} onPress={
                    handleCompleteSet
                }>
                    <Text style={styles.buttonStartLabel}>Erledigt</Text>
                </TouchableOpacity>
            )}

            {index + 1 >= exercises.length ? (
                <TouchableOpacity
                    style={styles.buttonSmall}
                    onPress={() => {

                        router.replace("(tabs)/(training)/training")
                        }}>
                    <Image source={icons.fastForward} style={styles.buttonIcon} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.buttonSmall}
                    onPress={handleNext
                    /*() => {
                        //navigation.navigate("Rest");
                        setTimeout(() => {
                            setIndex(index + 1);
                        }, 10);
                    }*/
                    }
                >
                    <Image source={icons.fastForward} style={styles.buttonIcon} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
        },
        buttonSmall: {
            flex: 1,
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: colors.baseColor,
            borderRadius: elements.buttonRadius,
            minHeight: 62,
        },
        buttonDone: {
            flex: 2,
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: colors.baseColor,
            borderRadius: elements.buttonRadius,
            minHeight: 62,
        },
        buttonIcon: {
            width: 30,
            height: 30,
            tintColor: colors.colorButtonLabel,
        },
        buttonStartLabel: {
            color: colors.colorButtonLabel,
            fontSize: textStyles.title_3,
            fontFamily: fontFamily.Poppins_SemiBold,
        },
    });
}

export default ExerciseNavigation;
