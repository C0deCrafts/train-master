import {View, StyleSheet} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {icons} from "../../../../constants";
import {useAccountSetting} from "../../../../context/AccountSettingContext";
import CustomCard from "../../../../components/CustomCard";

const TrainingData = () => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const {showStepsCount, setShowStepsCount} = useAccountSetting();

    const toggleSwitch = () => setShowStepsCount(previousState => !previousState);

    return (
        <>
            <CustomHeader title={"Trainingsdaten"} backButtonVisible={true}/>
            <View style={styles.container}>
                <CustomCard
                    label={"Schrittzähler aktivieren"}
                    image={icons.steps}
                    hasSwitch={true}
                    onSwitchValueChange={toggleSwitch}
                    switchValue={showStepsCount}
                    thumbColor={showStepsCount}
                />
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
        }
    });
};
