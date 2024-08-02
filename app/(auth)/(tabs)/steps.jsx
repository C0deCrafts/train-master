import React from 'react';
import {StyleSheet, View, Text} from "react-native";
import {useAppStyle} from "../../../context/AppStyleContext";
import BigDonutChart from "../../../components/BigDonutChart";

const Steps = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <View style={styles.container}>
            <BigDonutChart progress={0.5}/>
            <View style={styles.values}>
                <View>
                    <Text style={styles.label}>Steps</Text>
                    <Text style={styles.value}>1219</Text>
                </View>
                <View>
                    <Text style={styles.label}>Distance</Text>
                    <Text style={styles.value}>0,75 km</Text>
                </View>
                <View>
                    <Text style={styles.label}>Flights Climbed</Text>
                    <Text style={styles.value}>12</Text>
                </View>
            </View>


        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            justifyContent: "center",
            padding: 20
        },
        label: {
            color: colors.label,
            fontSize: 20,
        },
        values: {
            flexDirection: 'row',
            columnGap: 25,
            rowGap: 50,
            flexWrap: "wrap"
        },
        value: {
            fontSize: 35,
            color: colors.label
        }
    })
}

export default Steps;