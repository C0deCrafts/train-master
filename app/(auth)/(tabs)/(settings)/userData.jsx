import {View, Text, StyleSheet} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";

const UserData = () => {
    const {getColors, getTextStyles,fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <>
            <CustomHeader title={"Benutzerdaten"} backButtonVisible={true}/>
            <View style={styles.container}>
                <Text style={styles.text}>Benutzer DATA</Text>
            </View>
        </>
    );
};

export default UserData;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            padding: 20,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
        },
})}
