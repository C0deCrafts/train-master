import {
    ScrollView,
    StyleSheet,
    Text, View
} from 'react-native'
import {useLocalSearchParams} from "expo-router";
import {Video} from "expo-av";
import {useAppStyle} from "../../../../context/AppStyleContext";
import CustomHeader from "../../../../components/CustomHeader";
import Card from "../../../../components/Card";
import {useContext} from "react";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import {SafeAreaView} from "react-native-safe-area-context";
import Animated, {FadeInDown} from "react-native-reanimated";

const Exercises = () => {
    const { exercise, isHomeScreen } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const { exerciseVideos } = useContext(WorkoutContext);

    const styles = createStyles(textStyles, colors, fontFamily);
    const exerciseItem = exercise ? JSON.parse(exercise) : {};
    const videoUrl = exerciseVideos[exerciseItem.id] || ""

    return (
        <>
            <CustomHeader title={exerciseItem.name} backButtonVisible={true}/>
            <SafeAreaView style={styles.container}>
                {videoUrl && (
                    <Video
                        source={{uri: videoUrl}}
                        style={styles.video}
                        resizeMode="contain"
                        useNativeControls={false}
                        isLooping
                        shouldPlay
                    />
                )}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100).duration(300)}
                                   style={styles.cardContainer}>
                        {exerciseItem.sets && (
                            <Card style={styles.cardStyle}>
                                <Text style={styles.cardHeader}>Sätze</Text>
                                <Text style={styles.cardContent}>{exerciseItem.sets}x</Text>
                            </Card>
                        )}
                        {exerciseItem.repetitions && (
                            <Card style={styles.cardStyle}>
                                <Text style={styles.cardHeader}>WH</Text>
                                <Text style={styles.cardContent}>{exerciseItem.repetitions}x</Text>
                            </Card>
                        )}
                        {exerciseItem.weight && (
                            <Card style={styles.cardStyle}>
                                <Text style={styles.cardHeader}>Gewicht</Text>
                                <Text style={styles.cardContent}>{exerciseItem.weight} kg</Text>
                            </Card>
                        )}
                    </Animated.View>
                    <ScrollView style={styles.scrollBox} showsVerticalScrollIndicator={false}>
                        <Animated.Text entering={FadeInDown.delay(200).duration(300)}
                                       style={styles.information}><Text style={styles.bold}>Infos:</Text> {exerciseItem.description}</Animated.Text>
                        {exerciseItem.additionalInfo && (
                            <Animated.Text entering={FadeInDown.delay(300).duration(300)}
                                           style={styles.additionalInfo}><Text style={styles.bold}>Zusatzinfos:</Text> {exerciseItem.additionalInfo}</Animated.Text>
                        )}
                        {exerciseItem.heartRateZone && (
                            <Animated.Text entering={FadeInDown.delay(400).duration(300)}
                                           style={styles.additionalInfo}><Text style={styles.bold}>Heart Rate:</Text> {exerciseItem.heartRateZone}</Animated.Text>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingTop: -60
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

export default Exercises;
