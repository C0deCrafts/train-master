import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {colors} from "../constants";

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={[styles.container, containerStyles, isLoading && styles.loading]}
        >
            <Text style={[styles.text, textStyles]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.buttonBackgroundDark,
        minHeight: 62,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    text: {
        color: colors.textColorWhite,
        fontFamily: "Poppins-Regular",
        fontSize: 20
    },
    loading: {
        opacity: 0.5
    }
})