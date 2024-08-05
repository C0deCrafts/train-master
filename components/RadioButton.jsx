import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import {useAppStyle} from "../context/AppStyleContext";

const RadioButton = ({ button, isSelected, onPress }) => {
    const {getColors, getTextStyles,fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <TouchableOpacity onPress={!isSelected ? onPress : null}
                          disabled={isSelected}>
            <View style={styles.radioButton}>
                <Image source={button.image} style={styles.radioImage} />
                <Text style={styles.text}>{button.label}</Text>
                {isSelected ? (
                    <View style={styles.radioSelectedContainer}>
                        <View style={styles.radioSelected} />
                    </View>
                ) : (
                    <View style={styles.radioNotSelected} />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default RadioButton;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
    radioButton: {
        alignItems: "center",
        gap: 5
    },
    radioImage: {
        width: 60,
        height: 100
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: colors.baseColor
    },
    radioSelectedContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: colors.baseColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioNotSelected: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: colors.baseColor,
    },
    text: {
        fontFamily: fontFamily.Poppins_Regular,
        color: colors.label,
        textAlign: "left",
        fontSize: textStyles.subhead,
    }
})};
