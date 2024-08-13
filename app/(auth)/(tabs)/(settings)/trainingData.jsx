import {View, StyleSheet, Text} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {icons, images} from "../../../../constants";
import {useAccountSetting} from "../../../../context/AccountSettingContext";
import CustomCard from "../../../../components/CustomCard";
import {appStyles} from "../../../../constants/elementStyles";
import {Image} from "expo-image";

const TrainingData = () => {
    const { getTextStyles, getColors, fontFamily, bottomTabSpacing } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);
    const {showStepsCount, setShowStepsCount} = useAccountSetting();

    const toggleSwitch = () => {
        /*if(!hasPermission){
            Alert.alert("Zugriff verweigert!","Du hast den Zugriff auf deine Gesundheitsdaten abgelehnt, siehe Hinweis in der App!")
            return;
        }*/
        setShowStepsCount(previousState => !previousState);
    }

    return (
        <>
            <CustomHeader title={"Trainingsdaten"} backButtonVisible={true}/>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}><Text style={styles.titleDescription}>Hinweis: </Text>
                            Der Schrittzähler verwendet Daten von Apple Health. Um diese Funktion zu nutzen, stelle sicher, dass Apple Health auf deinem iPhone aktiviert und richtig eingestellt ist.</Text>
                    </View>

                    {/*hasPermission === false && (
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}><Text style={styles.titleDescription}>⚠️ Zugriff verweigert: </Text>Du hast den Zugriff auf deine Gesundheitsdaten abgelehnt, gehe zu den
                            <Text style={styles.titleNavLink}> iPhone-Einstellungen > Datenschutz > Health </Text>
                            und erlaube der Trainings-App den Zugriff auf die benötigten Daten um den Schrittzähler zu verwenden. Starte danach die App neu.
                        </Text>
                    </View>
                )*/}
                    <CustomCard
                        label={"Schrittzähler aktivieren"}
                        image={icons.steps}
                        hasSwitch={true}
                        onSwitchValueChange={toggleSwitch}
                        switchValue={showStepsCount}
                        thumbColor={showStepsCount}
                    />
                </View>
            </View>
        </>
    );
};

export default TrainingData;

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
        titleNavLink: {
            fontSize: textStyles.footnote,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
    }
    });
};
