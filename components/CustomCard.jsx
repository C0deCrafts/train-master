import {Text, StyleSheet, Switch, View} from "react-native";
import {Image} from "expo-image";
import Card from "./Card";
import {useAppStyle} from "../context/AppStyleContext";

const CustomCard = ({label, image, clickable, onPress, extraStyles, hasSwitch = false, switchValue, onSwitchValueChange, thumbColor}) => {
    const {getColors, getTextStyles,fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <>
            {hasSwitch ? (
                <Card style={[styles.cardWithSwitch, extraStyles]} clickable={clickable} onPress={onPress}>
                    <View style={styles.cardLabel}>
                        <Image style={styles.image} source={image}/>
                        <Text style={styles.textWithSwitch} numberOfLines={1} ellipsizeMode={"tail"}>{label}</Text>
                    </View>
                    <Switch
                        trackColor={{false: colors.gray_4, true: colors.gray_4}}
                        thumbColor={thumbColor ? colors.baseColor : colors.secondary}
                        ios_backgroundColor={colors.gray_4}
                        onValueChange={onSwitchValueChange}
                        value={switchValue}
                    />
                </Card>
            ) : (
                <Card style={[styles.card, extraStyles]} clickable={clickable} onPress={onPress}>
                    <Image style={styles.image} source={image}/>
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode={"tail"}>{label}</Text>
                </Card>)
            }
        </>
    );
};

export default CustomCard;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        card: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
        },
        cardWithSwitch: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        cardLabel: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
        },
        image: {
            width: 30,
            height: 30,
            contentFit: "contain",
            tintColor: colors.baseColor
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            textAlign: "left",
            fontSize: textStyles.subhead,
            width: "85%",
        },
        textWithSwitch: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            textAlign: "left",
            fontSize: textStyles.subhead,
            width: 220,
        }
    })}
