import {StyleSheet, Text, View} from "react-native";
import { Image } from 'expo-image';
import {useAppStyle} from "../context/AppStyleContext";
import {appStyles} from "../constants/elementStyles";

const TabIcon = ({icon, color, name, focused}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <View style={styles.container}>
            <Image
                source={icon}
                contentFit="contain"
                tintColor={color}
                style={{
                    width: 25,
                    height: 25,
                }}
            />
            <Text style={[styles.text, focused && styles.focusedText, { color: color }]} numberOfLines={1} ellipsizeMode="tail">
                {name}
            </Text>
        </View>
    )
}

export default TabIcon;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            gap: appStyles.tabLabelSpacing,
        },
        text: {
            fontSize: textStyles.caption_1,
            fontFamily: fontFamily.Poppins_Light
        },
        focusedText: {
            fontFamily: fontFamily.Poppins_Light
        }
    })
}