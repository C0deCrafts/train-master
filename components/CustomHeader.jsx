import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Image } from 'expo-image';
import {router, useNavigation} from 'expo-router';
import {icons} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {StatusBar} from "expo-status-bar";

const CustomHeader = ({title, backButtonVisible = false, backToAnotherScreen = false}) => {
    const navigation = useNavigation();
    const {getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme, textSize} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleGotToAnotherScreen = () => {
        router.dismissAll();
        router.replace({pathname: "/home"});
    };

    //console.log("Homescreen? ", backToAnotherScreen);
    //console.log("Type of isHomeScreen: ", typeof backToAnotherScreen);

    return (
        <>
            <StatusBar style={colors.colorButtonLabel === "rgb(0,0,0)" ? "dark" : "light"}/>
            <View style={styles.headerContainer}>
                {backButtonVisible && (
                    <TouchableOpacity onPress={backToAnotherScreen ? handleGotToAnotherScreen : handleGoBack} style={styles.backButtonContainer}>
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
