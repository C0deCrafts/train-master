import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ button, isSelected, onPress, colors, styles }) => {
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

const createStyles = (colors) => StyleSheet.create({
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
});
