import {View, Text, StyleSheet, Alert} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";
import useHealthData from "../../../../hook/useHealthData";
import CustomCard from "../../../../components/CustomCard";
import {icons, images} from "../../../../constants";
import Card from "../../../../components/Card";
import {useAuth} from "../../../../context/AuthContext";
import {appStyles} from "../../../../constants/elementStyles";
import {Image} from "expo-image";

const UserData = () => {
    const {getColors, getTextStyles,fontFamily, bottomTabSpacing} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);
    const {weight} = useHealthData();
    const {user} = useAuth();

    //fix problem, if no weight

    const handleUserNameChange = () => {
        Alert.alert("Hinweis!","Diese Funktion ist noch nicht verfügbar")
    }

    const handleWeightChange = () => {
        Alert.alert("Hinweis!","Diese Funktion ist noch nicht verfügbar")
    }

    const handleDeleteUser = () => {
        Alert.alert("Hinweis!","Diese Funktion ist noch nicht verfügbar")
    }

    return (
        <>
            <CustomHeader title={"Benutzerdaten"} backButtonVisible={true}/>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <View style={styles.spacing}>
                        <Text style={styles.title}>Benutzerdaten:</Text>
                    </View>
                    <Card style={styles.userDataContainer}>
                        <View style={styles.cardContainer}>
                            <Text style={styles.titleSmall}>Benutzername:</Text>
                            <Text style={styles.text}>{user.username}</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <Text style={styles.titleSmall}>E-Mail:</Text>
                            <Text style={styles.text}>{user.email}</Text>
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
                    <View style={styles.spacing}>
                        <Text style={styles.title}>Einstellungen ändern</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}><Text style={styles.titleDescription}>Hinweis: </Text>
                            Aktuell sind die unten angeführten Funktionen noch nicht freigeschaltet. Du wirst informiert, sobald diese Funktionen zur Verfügung stehen.
                        </Text>
                    </View>
                    <CustomCard
                        label={"Benutzername ändern"}
                        image={icons.text}
                        onPress={handleUserNameChange}
                        clickable
                    />
                    <CustomCard
                        label={"Aktuelles Gewicht ändern"}
                        image={icons.weight}
                        onPress={handleWeightChange}
                        clickable
                    />
                    <CustomCard
                        label={"Benutzerkonto löschen"}
                        image={icons.deleteIcon}
                        onPress={handleDeleteUser}
                        clickable
                    />
                </View>
            </View>
        </>
    );
};

export default UserData;

const createStyles = (textStyles, colors, fontFamily, bottomTabSpacing) => {
    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingBottom: bottomTabSpacing,
        },
        image: {
            position: "absolute",
            top: appStyles.backgroundImagePositionTopWithHeader,
            width: "100%",
            height: "100%",
            tintColor: colors.quaternaryLabel,
            pointerEvents: "none"
        },
        container: {
            flex: 1,
            //backgroundColor: colors.primary,
            paddingHorizontal: appStyles.spacingHorizontalDefault,
            paddingTop: appStyles.spacingFromHeader
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
            marginBottom: 5,
        },
        titleSmall: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.baseColor,
        },
        spacing: {
            //backgroundColor: "red",
            marginBottom: appStyles.cardTitleSpacingBottom - 5
        },
        userDataContainer: {
            backgroundColor: "transparent",
            padding: 0
        },
        descriptionContainer: {
            marginBottom: appStyles.cardTitleSpacingBottom
        },
        description: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
        },
        titleDescription: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.baseColor,
        },
})}
