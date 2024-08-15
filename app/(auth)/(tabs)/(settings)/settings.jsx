import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Image } from 'expo-image';
import {useState, useMemo, useEffect} from "react";
import {useAuth} from "../../../../context/AuthContext";
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
import {router} from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import CustomCard from "../../../../components/CustomCard";
import Avatar from "../../../../components/Avatar";
import {useAccountSetting} from "../../../../context/AccountSettingContext";
import {useNotifications} from "../../../../context/NotificationContext";
import CustomButton from "../../../../components/CustomButton";

const Settings = () => {
    const { user } = useAuth();
    const { textSize, setTextSize, getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme, bottomTabSpacing } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(colorScheme === "dark" ? "1" : "2");

    // Fix this - this is used if firebase data base changes - now it don't automatic change values from database - now I need a custom button to clear the cache
    // const { clearStorage } = useContext(WorkoutContext);
    const {handleProfileImageChange} = useAccountSetting();

    const {sendPushNotification, expoPushToken} = useNotifications();

    useEffect(() => {
        console.log(sendPushNotification)
    }, []);

    const handleSendNotification = async () => {
        if (expoPushToken) {
            await sendPushNotification(expoPushToken);
        } else {
            alert('Push token is not available');
        }
    };

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

    const handleTextSizeChange = (itemValue) => {
        setTextSize(itemValue);
        toggleModal();
    };

    const handleUserdataChange = () => {
        router.navigate("/userData")
    };

    const handleTrainDataChange = () => {
        router.navigate("/trainingData")
    }

    const currentColors = colorScheme === "dark" ? Object.entries(dark) : Object.entries(light);
    const limitedColors = currentColors.slice(0, 19);

    return (
        <>
            <CustomHeader title={"Einstellungen"} logOutButtonVisible/>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        <Card style={styles.userCard}>
                            <Avatar isPressableDisabled={true}
                                    isCameraVisible={false}
                                    imageRadius={80}
                            />
                            <View>
                                <Text style={styles.userName} numberOfLines={1} ellipsizeMode={"tail"}>{user.username}</Text>
                                <Text style={styles.email} numberOfLines={1} ellipsizeMode={"tail"}>{user.email.toLowerCase()}</Text>
                            </View>
                        </Card>
                        <View style={styles.spacing}>
                            <Text style={styles.title}>Persönliche Einstellungen</Text>
                        </View>
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
                        <View style={styles.spacing}>
                            <Text style={styles.title}>Trainings-Einstellungen</Text>
                        </View>
                        <CustomCard
                            label={"Trainingsdaten ändern"}
                            image={icons.heartbeat}
                            onPress={handleTrainDataChange}
                            clickable
                        />
                        <View style={styles.spacing}>
                            <Text style={styles.title}>App-Erscheinungsbild</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}><Text style={styles.titleDescription}>Dark Mode / Light Mode: </Text>
                                Wechsle zwischen dem Dark Mode und Light Mode, um das Erscheinungsbild der App anzupassen.</Text>
                        </View>
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
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}><Text style={styles.titleDescription}>Appfarbe: </Text>
                                Wähle eine Basisfarbe für die App. Diese Farbe wird für bestimmte Elemente in der App verwendet.</Text>
                        </View>
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
                                    onValueChange={handleTextSizeChange}
                            >
                                <Picker.Item label="xSmall" value="xSmall"/>
                                <Picker.Item label="Small" value="small"/>
                                <Picker.Item label="Medium" value="medium"/>
                                <Picker.Item label="Large (Default)" value="large_default"/>
                                <Picker.Item label="xLarge" value="xLarge"/>
                                <Picker.Item label="xxLarge" value="xxLarge"/>
                            </Picker>
                        </CustomModal>
                        {/*
                        // Fix this - this is used if firebase data base changes - now it don't automatic change values from database

                         <CustomButton title={"Cache löschen"} handlePress={clearStorage} containerStyles={{backgroundColor: colors.baseColor}}/>
                        */}
                        <CustomButton title={"Push senden"} handlePress={handleSendNotification} containerStyles={{backgroundColor: colors.baseColor}}/>
                    </ScrollView>
                </View>
            </View>
            <StatusBar style={colors.colorButtonLabel === "rgb(0,0,0)" ? "dark" : "light"}/>
        </>
    );
};

export default Settings;

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
            paddingHorizontal: 20
        },
        descriptionContainer: {
            marginBottom: appStyles.cardTitleSpacingBottom
        },
        description: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
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
        titleDescription: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.baseColor,
        },
        titleSmall: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
            //marginBottom: 5,
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
            //justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            gap: 20,
            marginTop: appStyles.spacingFromHeader,
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
            //marginTop: 5,
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
        spacing: {
            //backgroundColor: "red",
            marginBottom: appStyles.cardTitleSpacingBottom - 5
        }
    })
}