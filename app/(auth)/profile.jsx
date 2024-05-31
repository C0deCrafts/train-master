import {StyleSheet, Text, View} from 'react-native'
import {useAuth} from "../../context/AuthProvider";
import {FIRESTORE_DB} from "../../config/firebaseConfig";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import FormField from "../../components/FormField";
import {colors} from "../../constants";
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState("")

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        const userDocument = await getDoc(doc(FIRESTORE_DB, "users", user.uid));
        console.log("DATA: ",userDocument.data())
        if(userDocument.exists()){
            setUsername(userDocument.data().username);
        }
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

    const openImagePicker = async () => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync();

        if(pickerResult.canceled) {
            return;
        }
    }

    return (
        <View style={styles.container}>
            <FormField placeholder={username}
                       label={"Ändere deinen Benutzernamen"}
                       value={username}
                       handleChangeText={setUsername}
                       isLabel={true}
                       labelStyle={{
                           color: colors.textColorBlack
                       }}
                       onSubmitEditing={()=> handleUpdateUsername()}
                       returnKeyType="done"
            />
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    }
})