import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useNavigation } from 'expo-router';
import {colors, icons} from "../constants";

const CustomHeader = ({ title, backButtonVisible=false }) => {
    const navigation = useNavigation();

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

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        height: 120,
        backgroundColor: colors.backgroundColorBlueGreen,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 5
    },
    backButtonContainer: {
        position: "absolute"
    },
    backButton: {
        top: 83,
        left: 10,
        tintColor: colors.white,
        width: 30,
        height: 30
    },
    headerTitle: {
        color: colors.white,
        fontFamily: "Poppins-SemiBold",
        fontSize: 25,
        maxWidth: "80%"
    },
});

export default CustomHeader;
