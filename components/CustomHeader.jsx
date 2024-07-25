import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from 'expo-router';
import {icons} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {large_default} from "../constants/textStyles";

const CustomHeader = ({title, backButtonVisible = false}) => {
    const navigation = useNavigation();
    const {getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme, textSize} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const handleGoBack = () => {
        navigation.goBack();
    }

    return (
        <>
            <View style={styles.headerContainer}>
                {backButtonVisible && (
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButtonContainer}>
                        <Image source={icons.back} style={styles.backButton}/>
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            </View>
        </>

    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        headerContainer: {
            width: "100%",
            height: 120,
            backgroundColor: colors.baseColor,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingBottom: 5,
            position: "relative",
        },
        backButtonContainer: {
            position: "absolute",
            top: 83,
            left: 10,
            zIndex: 1,
        },
        backButton: {
            tintColor: colors.colorButtonLabel,
            width: 30,
            height: 30,
        },
        headerTitle: {
            color: colors.colorButtonLabel,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.title_2,
            maxWidth: "80%",
            textAlign: "center",
        },
    });
}

export default CustomHeader;
