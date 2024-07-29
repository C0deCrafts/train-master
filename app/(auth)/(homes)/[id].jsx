import {
    Image, ScrollView,
    StyleSheet,
    Text, View
} from 'react-native'
import {useAppStyle} from "../../../context/AppStyleContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, useLocalSearchParams} from "expo-router";
import CustomHeader from "../../../components/CustomHeader";
import Card from "../../../components/Card";
import {Video} from "expo-av";

const TrainGroup = () => {
    const { id, item } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);
    const workoutItem = item ? JSON.parse(item) : {};

    return (
        <View style={styles.container}>
            <CustomHeader title={workoutItem.name} backButtonVisible={true}/>
            {workoutItem.video && (
                <Video
                    source={workoutItem.video}
                    style={styles.video}
                    resizeMode="contain"
                    useNativeControls={false}
                    isLooping
                    shouldPlay
                />
            )}
            <View style={styles.content}>
                {/*<Image source={workoutItem.image} style={styles.exerciseImage}/>*/}
                <View style={styles.cardContainer}>
                    {workoutItem.sets && (
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardHeader}>Sätze</Text>
                            <Text style={styles.cardContent}>x{workoutItem.sets}</Text>
                        </Card>
                    )}
                    {workoutItem.repetitions && (
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardHeader}>WH</Text>
                            <Text style={styles.cardContent}>x{workoutItem.repetitions}</Text>
                        </Card>
                    )}
                    {workoutItem.weight && (
                        <Card style={styles.cardStyle}>
                            <Text style={styles.cardHeader}>Gewicht</Text>
                            <Text style={styles.cardContent}>x{workoutItem.weight}</Text>
                        </Card>
                    )}
                </View>
                <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
                    <Text style={styles.information}><Text style={styles.bold}>Infos:</Text> {workoutItem.description}</Text>
                    {workoutItem.additionalInfo && (
                        <Text style={styles.additionalInfo}><Text style={styles.bold}>Zusatzinfos:</Text> {workoutItem.additionalInfo}</Text>
                    )}
                    {workoutItem.heartRateZone && (
                        <Text style={styles.additionalInfo}><Text style={styles.bold}>Heart Rate:</Text> {workoutItem.heartRateZone}</Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        content: {
            backgroundColor: colors.secondary,
            flex: 1,
            paddingHorizontal: 20,
            padding: 20,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        imageContainer: {
            flexDirection: "row"
        },
        cardContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginBottom: 10
            //backgroundColor: "red"
        },
        cardStyle: {
            backgroundColor: colors.baseColor,
            width: "30%"
        },
        cardHeader: {
            fontSize: textStyles.footnote,
            color: colors.colorButtonLabel,
            textAlign: "center"
        },
        cardContent: {
            fontSize: textStyles.body,
            fontWeight: "bold",
            color: colors.colorButtonLabel,
            textAlign: "center"
        },
        descriptionContainer: {

        },
        description: {
            fontSize: textStyles.body,
            textAlign: "justify",
        },
        exerciseImage: {
            width: "100%",
            height: 370
        },
        video: {
            //width: windowWidth,
            height: 220,
            marginTop: 0,
        },
        information: {
            textAlign: "justify",
            fontSize: textStyles.body,
            color: colors.label
        },
        additionalInfo: {
            marginTop: 10,
            textAlign: "justify",
            fontSize: textStyles.body,
            color: colors.label
        },
        scrollBox: {
            flex: 1
        },
        bold: {
            fontWeight: "bold",
        }
    })
}

export default TrainGroup;