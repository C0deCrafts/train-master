import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Image } from 'expo-image';
import {router} from 'expo-router';
import {icons} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {StatusBar} from "expo-status-bar";
import {useAuth} from "../context/AuthContext";

const CustomHeader = ({title, backButtonVisible = false, logOutButtonVisible = false}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const {logout} = useAuth();

    const handleGoBack = () => {
        router.back();
    };

    const handleLogout = async () => {
        //console.log("Logout")
        await logout();
    };

    return (
        <>
            <View style={styles.headerContainer}>
                {backButtonVisible && (
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButtonContainer}>
                        <Image source={icons.back} style={styles.backButton}/>
                    </TouchableOpacity>
                )}
                {logOutButtonVisible && (
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonContainer}>
                        <Image source={icons.logout} style={styles.icon} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            </View>
            <StatusBar style={colors.colorButtonLabel === "rgb(0,0,0)" ? "dark" : "light"}/>
        </>

    );
};

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        headerContainer: {
            width: "100%",
            //120
            height: 110,
            backgroundColor: colors.baseColor,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingBottom: 5,
            position: "relative",
        },
        backButtonContainer: {
            position: "absolute",
            top: 73,
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
        logoutButtonContainer: {
            position: "absolute",
            top: 73,
            right: 10,
            zIndex: 1,
        },
        icon: {
            width: 28,
            height: 28,
            tintColor: colors.colorButtonLabel,
        }
    });
}

export default CustomHeader;
