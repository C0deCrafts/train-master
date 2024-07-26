import {
    Button,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import FormField from "../../components/FormField";
import {useState, useMemo} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {useAuth} from "../../context/AuthProvider";
import {useAppStyle} from "../../context/AppStyleContext";
import {images, icons} from "../../constants";
import {Picker} from "@react-native-picker/picker";
import ColorPicker from "../../components/ColorPicker";
import {dark, light} from "../../constants/colors";
import {appStyles} from "../../constants/elementStyles";
import Card from "../../components/Card";

const Settings = () => {
    const { user, username, setUsername, email, handleUpdateUsername } = useAuth();
    const [darkmodeLabel, setDarkmodeLabel] = useState("Darkmode");
    const { textSize, setTextSize, getTextStyles, getColors, getAllBaseColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isUsernameModalVisible, setUsernameModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState(username);
    const [selectedId, setSelectedId] = useState(colorScheme === "dark" ? "1" : "2");

    const styles = createStyles(textStyles, colors, fontFamily);


    const radioButtons = useMemo(() => ([
        {
            id: "1",
            label: "Dunkel",
            value: "dark",
            image: images.darkmode // Hinzufügen des Bildes für Darkmode
        },
        {
            id: '2',
            label: "Hell",
            value: "light",
            image: images.lightmode // Hinzufügen des Bildes für Lightmode
        }
    ]), []);

    const handleColorChange = (color) => {
        updateBaseColor(color)
        //updateBaseColor(colors.teal)
    };

    const handleDarkModeChange = () => {
        const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newColorScheme);
        setIsEnabled(previousState => !previousState);
        setDarkmodeLabel(newColorScheme === "light" ? "Lightmode" : "Darkmode");
        setSelectedId(newColorScheme === "light" ? "2" : "1");
    };

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const currentColors = colorScheme === "Darkmode" ? Object.entries(dark) : Object.entries(light);
    const limitedColors = currentColors.slice(0, 19);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleUsernameModal = () => {
        setUsernameModalVisible(!isUsernameModalVisible);
    };

    const handlePickerChange = (itemValue) => {
        setTextSize(itemValue);
        toggleModal();
    };

    const handleUsernameChange = () => {
        handleUpdateUsername(newUsername);
        //console.log("Username")
        toggleUsernameModal();
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
                <Card style={styles.userCard}>
                    <Image
                        source={images.avatar}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius:"50%",
                            resizeMode: "contain",
                        }}
                    />
                    <View>
                        <Text style={styles.userName}>{username}</Text>
                        <Text style={styles.email}>{email.toLowerCase()}</Text>
                    </View>
                </Card>
                <Text style={styles.title}>Account Einstellungen</Text>
                <Card style={styles.card}>
                    <Image source={icons.camera}
                           style={{
                               width: 30,
                               height: 30,
                               resizeMode: "contain",
                               tintColor: colors.baseColor
                           }}
                    />
                    <Text style={styles.text}>Profilbild ändern</Text>
                </Card>
                <Card style={styles.card} clickable={true} onPress={handleUsernameChange}>
                    <Image source={icons.profile}
                           style={{
                               width: 30,
                               height: 30,
                               resizeMode: "contain",
                               tintColor: colors.baseColor
                           }}
                    />
                    <Text style={styles.text}>Benutzername ändern</Text>
                </Card>
                <Text style={styles.title}>App Einstellungen</Text>
                <Text style={styles.titleSmall}>Erscheinungsbild</Text>
                <Card>
                    <View style={styles.radioGroupContainer}>
                        {radioButtons.map((button) => (
                            <TouchableOpacity key={button.id} onPress={handleDarkModeChange}>
                                <View style={styles.radioButton}>
                                    <Image source={button.image} style={styles.radioImage} />
                                    {selectedId === button.id ? (
                                        <>
                                            <Text style={styles.text}>{button.label}</Text>
                                            <View style={styles.radioSelectedContainer}>
                                                <View style={styles.radioSelected} />
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.text}>{button.label}</Text>
                                            <View style={styles.radioNotSelected} />
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>
                <Text style={styles.titleSmall}>Basisfarbe</Text>
                <Card>
                    <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false} bounces={true}
                    >
                        {limitedColors.map(([key, value], index) => (
                            <View key={index} style={[styles.colorPickerContainer, {marginHorizontal: 5}]}>
                                <ColorPicker color={value}
                                    //onPress={() => console.log("COLOR: "+ key + "index: " + index)}
                                             onPress={() => handleColorChange(value)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </Card>
                <View>
                    <Card style={styles.card} clickable={true} onPress={toggleModal}>
                        <Image source={icons.fontsize}
                               style={{
                                   width: 30,
                                   height: 30,
                                   resizeMode: "contain",
                                   tintColor: colors.baseColor
                               }}
                        />
                        <Text>Ändere Textgröße</Text>
                    </Card>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={toggleModal}
                    >
                        <TouchableOpacity style={styles.modalContainer} onPress={toggleModal} activeOpacity={1}>
                            <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                                <Text style={styles.modalText}>Wähle deine gewünschte Textgröße aus:</Text>
                                <Picker
                                    selectedValue={textSize}
                                    onValueChange={(itemValue) => handlePickerChange(itemValue)}
                                >
                                    <Picker.Item label="xSmall" value="xSmall" />
                                    <Picker.Item label="Small" value="small" />
                                    <Picker.Item label="Medium" value="medium" />
                                    <Picker.Item label="Large (Default)" value="large_default" />
                                    <Picker.Item label="xLarge" value="xLarge" />
                                    <Picker.Item label="xxLarge" value="xxLarge" />
                                </Picker>
                                <Button title="Schließen" onPress={toggleModal} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isUsernameModalVisible}
                        onRequestClose={toggleUsernameModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Geben Sie Ihren neuen Benutzernamen ein:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    placeholder="Neuer Benutzername"
                                />
                                <Button title="OK" onPress={handleUsernameChange} />
                                <Button title="Abbrechen" onPress={toggleUsernameModal} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
                {/*<Text>Ändere Textgröße</Text>
                <Picker
                    selectedValue={textSize}
                    onValueChange={(item) => setTextSize(item)}
                >
                    <Picker.Item label="xSmall" value="xSmall" />
                    <Picker.Item label="Small" value="small" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="Large" value="large_default" />
                    <Picker.Item label="xLarge" value="xLarge" />
                    <Picker.Item label="xxLarge" value="xxLarge" />
                </Picker>*/}

        </View>
    );
};

export default Settings;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
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
            color: colors.label
        },
        email: {
            fontSize: textStyles.footnote,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
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
            //backgroundColor: "transparent",
            //borderBottomColor: colors.opaqueSeparator,
            //borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
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
            textAlign: "center"
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

    })
}