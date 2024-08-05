import {View, Text, Switch, StyleSheet} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {useEffect, useState} from "react";
import {useAppleHealthKit} from "../../../../context/AppleHealthKitContext";
import {Image} from "expo-image";
import {icons} from "../../../../constants";
import Card from "../../../../components/Card";

const TrainingData = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const {showStepsCount, setShowStepsCount} = useAppleHealthKit();

    const toggleSwitch = () => setShowStepsCount(previousState => !previousState);

    useEffect(() => {
        console.log("Enabled? ", showStepsCount)
    }, [showStepsCount]);

    return (
        <>
            <CustomHeader title={"Trainingsdaten"} backButtonVisible={true}/>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <View style={styles.cardLabel}>
                        <Image source={icons.steps}
                               style={{
                                   width: 30,
                                   height: 30,
                                   contentFit: "contain",
                                   tintColor: colors.baseColor
                               }}
                        />
                        <Text style={styles.text} numberOfLines={1} ellipsizeMode={"tail"}>Schrittzähler aktivieren</Text>
                    </View>
                    <Switch
                        trackColor={{false: colors.gray_4, true: colors.gray_4}}
                        thumbColor={showStepsCount ? colors.baseColor : colors.secondary}
                        ios_backgroundColor={colors.gray_4}
                        onValueChange={toggleSwitch}
                        value={showStepsCount}
                    />
                </Card>
            </View>
        </>
    );
};

export default TrainingData;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            padding: 20,
        },
        card: {
            flexDirection: "row",
            justifyContent: "space-between"
        },
        cardLabel: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
        },
        text: {
            //flex: 1,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            textAlign: "center",
            fontSize: textStyles.subhead,
            width: 220,
        },
    });
};
