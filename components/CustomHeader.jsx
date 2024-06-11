import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useNavigation } from 'expo-router';
import {colors, icons} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";

//back button funktioniert nicht!!

const CustomHeader = ({ title, backButtonVisible=false }) => {
    const navigation = useNavigation();
    const { getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);


    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            </View>
            {backButtonVisible &&(
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
                    <Image source={icons.back} style={styles.backButton}/>
                </TouchableOpacity>
            )}
        </View>
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
            paddingBottom: 5
        },
        backButtonContainer: {
            position: "absolute",
        },
        backButton: {
            top: 83,
            left: 10,
            tintColor: colors.colorButtonLabel,
            width: 30,
            height: 30
        },
        headerTitle: {
            color: colors.colorButtonLabel,
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: 25,
            maxWidth: "80%"
        },
    });
}

export default CustomHeader;
