import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useAppStyle} from "../context/AppStyleContext";

const CustomButton = ({title, handlePress, containerStyles, textStyle, isLoading}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

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

const createStyles = (textStyles, colors, fontFamily) => {
return StyleSheet.create({
    container: {
        backgroundColor: colors.dark,
        minHeight: 62,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    text: {
        color: colors.colorButtonLabel,
        fontFamily: fontFamily.Poppins_SemiBold,
        fontSize: textStyles.title_3
    },
    loading: {
        opacity: 0.5
    }
})}