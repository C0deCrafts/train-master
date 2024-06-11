import {Button, StyleSheet, Text, View} from 'react-native'
import FormField from "../../components/FormField";
import {colors} from "../../constants";
import {useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {useAuth} from "../../context/AuthProvider";
import {useAppStyle} from "../../context/AppStyleContext";

/*
const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({})
}
*/

const Settings = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const { getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const handleColorChange = () => {
        updateBaseColor(colors.pink)
    };

    const handleUpdateUsername = async () => {
        try {
            await updateDoc(doc(FIRESTORE_DB, 'users', user.uid), {
                username: username
            });
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Menü</Text>
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
                <Button
                    title={colorScheme === 'light' ? "Wechsel zu Dark Mode" : "Wechsel zu Light Mode"}
                    onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                />
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
        }
    })
}