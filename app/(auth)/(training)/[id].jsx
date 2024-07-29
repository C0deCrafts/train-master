import {View, Text, StyleSheet} from "react-native";
import CustomHeader from "../../../components/CustomHeader";
import {useLocalSearchParams} from "expo-router";
import {useAppStyle} from "../../../context/AppStyleContext";

const Exercises = () => {
    const { id, item } = useLocalSearchParams();
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);
    const workoutItem = item ? JSON.parse(item) : {};

    const calculateTotalDuration = () => {
        let calc = 0;
        workoutItem.exercises.forEach((exercise) => {
            calc += exercise.duration;
        })

        return calc;
    };


    return (
        <View style={styles.container}>
            <CustomHeader title={workoutItem.name} backButtonVisible={true}/>
            <Text>Exercises</Text>
            <Text>{id}</Text>
            {workoutItem.exercises?.map((item, index) => (
                <View key={index}>
                    <Text>{item.name}</Text>
                    <Text>{item.duration}</Text>
                </View>
            ))}
            <Text>{calculateTotalDuration()}</Text>
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

export default Exercises;