import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Image } from 'expo-image';
import {useState, useMemo, useContext} from "react";
import {useAuth} from "../../../../context/AuthProvider";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {images, icons} from "../../../../constants";
import {Picker} from "@react-native-picker/picker";
import ColorPicker from "../../../../components/ColorPicker";
import {dark, light} from "../../../../constants/colors";
import {appStyles} from "../../../../constants/elementStyles";
import Card from "../../../../components/Card";
import RadioButton from "../../../../components/RadioButton";
import CustomModal from "../../../../components/CustomModal";
import {StatusBar} from "expo-status-bar";
import CustomButton from "../../../../components/CustomButton";
import {WorkoutContext} from "../../../../context/WorkoutContext";
import {router} from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import CustomCard from "../../../../components/CustomCard";

const Settings = () => {
    const { user, username, setUsername, email, handleUpdateUsername } = useAuth();
    const { textSize, setTextSize, getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(colorScheme === "dark" ? "1" : "2");

    const { clearStorage } = useContext(WorkoutContext);

    const radioButtons = useMemo(() => ([
        {
            id: "1",
            label: "Dunkel",
            value: "dark",
            image: images.darkmode
        },
        {
            id: '2',
            label: "Hell",
            value: "light",
            image: images.lightmode
        }
    ]), []);

    const handleColorChange = (color) => {
        updateBaseColor(color);
    };

    const handleDarkModeChange = () => {
        const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newColorScheme);
        setSelectedId(newColorScheme === "light" ? "2" : "1");
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handlePickerChange = (itemValue) => {
        setTextSize(itemValue);
        toggleModal();
    };

    const handleUserdataChange = () => {
        //handleUpdateUsername(newUsername);
        //toggleUsernameModal();
        //evtl username auf leer wenn aufgerufen - bzw wenn okay
        console.log("Navigate zu Benutzerdaten ändern")
        router.navigate("/userData")
    };

    const handleProfileImageChange = () => {
        console.log("Bild ändern")
    }

    const handleTrainDataChange = () => {
        console.log("Navigate zu TrainDATA")
        router.navigate("/trainingData")
    }

    const currentColors = colorScheme === "dark" ? Object.entries(dark) : Object.entries(light);
    const limitedColors = currentColors.slice(0, 19);

    return (
        <>
            <CustomHeader title={"Einstellungen"} logOutButtonVisible={true}/>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
                        <Card style={styles.userCard}>
                            <Image
                                source={images.avatar}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    contentFit: "contain",
                                }}
                            />
                            <View>
                                <Text style={styles.userName} numberOfLines={1} ellipsizeMode={"tail"}>{username}</Text>
                                <Text style={styles.email} numberOfLines={1} ellipsizeMode={"tail"}>{email.toLowerCase()}</Text>
                            </View>
                        </Card>
                        <Text style={styles.title}>Account Einstellungen</Text>
                        <CustomCard
                            label={"Profilbild ändern"}
                            image={icons.camera}
                            onPress={handleProfileImageChange}
                            clickable
                        />
                        <CustomCard
                            label={"Benutzerdaten ändern"}
                            image={icons.profile}
                            onPress={handleUserdataChange}
                            clickable
                        />
                        <CustomCard
                            label={"Trainingsdaten ändern"}
                            image={icons.heartbeat}
                            onPress={handleTrainDataChange}
                            clickable
                        />
                        <Text style={styles.title}>App Einstellungen</Text>
                        <Text style={[styles.titleSmall, styles.spacingTop]}>Erscheinungsbild</Text>
                        <Card>
                            <View style={styles.radioGroupContainer}>
                                {radioButtons.map((button) => (
                                    <RadioButton
                                        key={button.id}
                                        button={button}
                                        isSelected={selectedId === button.id}
                                        onPress={handleDarkModeChange}
                                    />

                                ))}
                            </View>
                        </Card>
                        <Text style={[styles.titleSmall, styles.spacingTop]}>Basisfarbe</Text>
                        <Card>
                            <ScrollView horizontal={true}
                                        showsHorizontalScrollIndicator={false} bounces={true}
                            >
                                {limitedColors.map(([key, value], index) => (
                                    <View key={index} style={[styles.colorPickerContainer, {marginHorizontal: 5}]}>
                                        <ColorPicker color={value}
                                                     onPress={() => handleColorChange(value)}
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </Card>
                        <CustomCard
                            label={"Ändere Textgröße"}
                            image={icons.fontsize}
                            onPress={toggleModal}
                            clickable
                            extraStyles={styles.spacingBottom}
                        />
                        <CustomModal isVisible={isModalVisible} onClose={toggleModal} styles={styles}>
                            <Text style={styles.modalText}>Wähle deine gewünschte Textgröße aus:</Text>
                            <Picker selectedValue={textSize}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                    onValueChange={handlePickerChange}
                            >
                                <Picker.Item label="xSmall" value="xSmall"/>
                                <Picker.Item label="Small" value="small"/>
                                <Picker.Item label="Medium" value="medium"/>
                                <Picker.Item label="Large (Default)" value="large_default"/>
                                <Picker.Item label="xLarge" value="xLarge"/>
                                <Picker.Item label="xxLarge" value="xxLarge"/>
                            </Picker>
                        </CustomModal>
                        <CustomButton title={"Cache löschen"} handlePress={clearStorage} containerStyles={{backgroundColor: colors.baseColor}}/>
                    </ScrollView>
                </View>
            </View>
            <StatusBar style={colors.colorButtonLabel === "rgb(0,0,0)" ? "dark" : "light"}/>
        </>
    );
};

export default Settings;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        image: {
            position: "absolute",
            top: -50,
            width: "100%",
            height: "100%",
            contentFit: "contain",
            tintColor: colors.quaternaryLabel,
            pointerEvents: "none"
        },
        container: {
            flex: 1,
            paddingHorizontal: 20
        },
        header: {
            fontSize: textStyles.title_1,
            fontFamily: fontFamily.Poppins_SemiBold,
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
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            marginBottom: 5,
        },
        userName: {
            fontSize: textStyles.body,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            width: 300,
        },
        email: {
            fontSize: textStyles.footnote,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            width: 300,
        },
        userCard: {
            backgroundColor: "transparent",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            gap: 20,
            marginTop: 20
        },
        card: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
        },
        input: {
            //backgroundColor: "red",
            padding: 10,
            textAlign: "center",
            borderRadius: 16,
            marginVertical: 20,
            borderWidth: 2,
            fontSize: textStyles.body
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            textAlign: "center",
        },
        imageContainer: {
            flexDirection: "row"
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: colors.secondaryLabel
        },
        modalContent: {
            width: "100%",
            padding: 20,
            backgroundColor: colors.secondary,
            borderTopLeftRadius: appStyles.modalRadius,
            borderTopRightRadius: appStyles.modalRadius,
        },
        modalText: {
            fontSize: textStyles.body,
            textAlign: "center",
            color: colors.label
        },
        radioGroupContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: 20,
        },
        radioButton: {
            alignItems: "center",
            //backgroundColor: "blue",
            gap: 5
        },
        radioImage: {
            width: 60,
            height: 100
        },
        radioSelected: {
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: colors.baseColor
            //hier möchte ich einen standard radiobutton anzeigen
        },
        radioSelectedContainer: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: colors.baseColor,
            alignItems: 'center',
            justifyContent: 'center'
        },
        radioNotSelected: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: colors.baseColor,
        },
        spacingTop: {
            marginTop: 5,
        },
        spacingBottom: {
            marginBottom: 20,
        },
        picker: {

        },
        pickerItem: {
            color: colors.label,
            fontSize: textStyles.title_2,
        },
    })
}