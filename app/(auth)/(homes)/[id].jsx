import {
    StyleSheet,
    Text, View
} from 'react-native'
import {useAppStyle} from "../../../context/AppStyleContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

const TrainGroup = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <SafeAreaView>
            <CustomHeader title={"Back"} backButtonVisible={true}/>
            <Text>Test</Text>

        </SafeAreaView>
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