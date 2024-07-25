import {
    StyleSheet,
    Text, View
} from 'react-native'
import {useAppStyle} from "../../../context/AppStyleContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link, useLocalSearchParams} from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

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
            <Text>Test</Text>
            <Text>{id}</Text>
            <Text>Name: {workoutItem.name}</Text>
        </View>
    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        imageContainer: {
            flexDirection: "row"
        }
    })
}

export default TrainGroup;