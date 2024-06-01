import { StyleSheet, Text, View } from 'react-native'
import FormField from "../../components/FormField";
import {colors} from "../../constants";
import {useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {useAuth} from "../../context/AuthProvider";

const Settings = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState("");

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
        <View>
            <Text>Menü</Text>
            <View>
                <FormField placeholder={username}
                           label={"Ändere deinen Benutzernamen"}
                           value={username}
                           handleChangeText={setUsername}
                           isLabel={true}
                           labelStyle={{
                               color: colors.textColorBlack,
                           }}
                           onSubmitEditing={()=> handleUpdateUsername()}
                           returnKeyType="done"
                />
            </View>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({})