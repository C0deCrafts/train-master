import {Button, Image, StyleSheet, Switch, Text, View} from 'react-native'
import FormField from "../../components/FormField";
import {useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {useAuth} from "../../context/AuthProvider";
import {useAppStyle} from "../../context/AppStyleContext";
import {images} from "../../constants";
import {Picker} from "@react-native-picker/picker";

/*
const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({})
}
*/

const Settings = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const [darkmodeLabel, setDarkmodeLabel] = useState("Darkmode");
    const { textSize, setTextSize, getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const handleColorChange = () => {
        updateBaseColor(colors.orange)
    };

    const handleDarkModeChange = () => {
        setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
        setIsEnabled(previousState => !previousState);
        setDarkmodeLabel(darkmodeLabel === "Darkmode" ? "Lightmode" : "Darkmode");
    }

    const handleUpdateUsername = async () => {
        try {
            await updateDoc(doc(FIRESTORE_DB, 'users', user.uid), {
                username: username
            });
        } catch (err) {
            console.error(err);
        }
    }

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Aktiviere {darkmodeLabel}</Text>
            <View style={styles.imageContainer}>
                <Image
                    source={images.lightmode}
                    style={{
                        width: 60,
                        height: 100
                    }}
                />
                <Image
                    source={images.darkmode}
                    style={{
                        width: 60,
                        height: 100
                    }}
                />
            </View>
            <Switch
                trackColor={{false: colors.secondary, true: colors.baseColor}}
                ios_backgroundColor={colors.quaternaryLabel}
                onValueChange={handleDarkModeChange}
                value={isEnabled}
            />
            <View>
                <FormField placeholder={username}
                           label={"Ändere deinen Benutzernamen"}
                           value={username}
                           handleChangeText={setUsername}
                           isLabel={true}
                           labelStyle={{
                               color: colors.label,
                           }}
                           onSubmitEditing={()=> handleUpdateUsername()}
                           returnKeyType="done"
                />
                <Button title="Farbe ändern" onPress={handleColorChange} />
            </View>
            <View>
                <Text>Ändere Textgröße</Text>
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
                </Picker>
            </View>
        </View>
    );
};

export default Settings;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        imageContainer: {
            flexDirection: "row"
        }
    })
}