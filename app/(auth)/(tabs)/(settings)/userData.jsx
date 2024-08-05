import {View, Text, StyleSheet} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";
import useHealthData from "../../../../hook/useHealthData";
import CustomCard from "../../../../components/CustomCard";
import {icons} from "../../../../constants";
import Card from "../../../../components/Card";
import {useContext} from "react";
import {useAuth} from "../../../../context/AuthProvider";

const UserData = () => {
    const {getColors, getTextStyles,fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);
    const {weight} = useHealthData();
    const {username} = useAuth();

    const handleUserNameChange = () => {
        console.log("Usernamen ändern")
    }

    const handleWeightChange = () => {
        console.log("Gewicht ändern")
    }

    return (
        <>
            <CustomHeader title={"Benutzerdaten"} backButtonVisible={true}/>
            <View style={styles.container}>
                <Text style={styles.title}>Benutzerdaten:</Text>
                <Card>
                    <View style={styles.cardContainer}>
                        <Text style={styles.titleSmall}>Benutzername:</Text>
                        <Text style={styles.text}>{username}</Text>
                    </View>
                    {weight ? (
                        <View style={styles.cardContainer}>
                            <Text style={styles.titleSmall}>Aktuelles Gewicht:</Text>
                            <Text style={styles.text}>{weight} kg</Text>
                        </View>
                    ):(
                        <View style={styles.cardContainer}>
                            <Text style={styles.titleSmall}>Aktuelles Gewicht:</Text>
                            <Text style={styles.text}>kein Gewicht festgelegt</Text>
                        </View>
                    )}
                </Card>
                <Text style={styles.title}>Einstellungen ändern</Text>
                <CustomCard
                    label={"Benutzername ändern"}
                    image={icons.profile}
                    onPress={handleUserNameChange}
                    clickable
                />
                <CustomCard
                    label={"Aktuelles Gewicht ändern"}
                    image={icons.profile}
                    onPress={handleWeightChange}
                    clickable
                />
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
        cardContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
        },
        title: {
            fontSize: textStyles.title_3,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            marginVertical: 5,
        },
        titleSmall: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
        },
})}
