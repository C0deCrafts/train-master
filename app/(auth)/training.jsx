import { StyleSheet, Text, View } from 'react-native'
import {useAppStyle} from "../../context/AppStyleContext";

const Training = () => {
    const { getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Groups</Text>
        </View>
    );
};

export default Training;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        }
    })
}