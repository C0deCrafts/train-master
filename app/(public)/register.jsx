import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {colors, icons, images} from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import {Link} from "expo-router";
import {useEffect, useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {FIREBASE_AUTH, FIRESTORE_DB} from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleRegistration = async () => {
        try{
            setLoading(true);
            const user = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            //console.log("Register: ", user)
            await createUserInformation(user)
        } catch (err) {
            console.log("Register Error: ", err)
        } finally {
            setLoading(false)
        }
    }

    const createUserInformation = async(user) => {
        try {
            const docRef = doc(FIRESTORE_DB, `users/${user.user.uid}`)
            await setDoc(docRef, {
                username,
                email
            });
        } catch (err) {
            console.log("Error DB: ", err)
        }
    }

    return (
        <ImageBackground
            source={images.backgroundMale}
            style={styles.container}
        >
            <Image
                source={images.backgroundSymbol}
                style={styles.symbol}
            />
            <SafeAreaView style={styles.content}>
                <Spinner visible={loading}/>
                <View style={styles.formContainer}>
                    <FormField placeholder="Benutzername" otherStyles={{marginBottom: 16}} value={username}
                               handleChangeText={setUsername}/>
                    <FormField placeholder="E-Mail" otherStyles={{marginBottom: 16}} value={email}
                               handleChangeText={setEmail}/>
                    <FormField placeholder="Passwort" isPassword={true} otherStyles={{marginBottom: 16}}
                               value={password} handleChangeText={setPassword}/>
                    <FormField placeholder="Bestätige Passwort" isPassword={true} value={confirmPassword}
                               handleChangeText={setConfirmPassword}/>
                    <CustomButton title="Registrieren" containerStyles={{marginTop: 40}} handlePress={handleRegistration}/>
                    <Text style={styles.text}>oder</Text>
                    <View style={styles.loginIconContainer}>
                        <Image source={icons.apple} style={styles.loginIcons}/>
                        <Image source={icons.facebook} style={styles.loginIcons}/>
                        <Image source={icons.google} style={styles.loginIcons}/>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Du hast bereits einen Account?</Text>
                    <Link replace href={"/login"} style={styles.footerLink}>Logge dich ein!</Link>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );

};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        //backgroundColor: "yellow"
    },
    text: {
        marginTop: 15,
        textAlign: "center",
        color: colors.textColorWhite,
        fontFamily: "Poppins-Regular",
    },
    forgotPasswordText: {
        marginTop: 8,
        textAlign: "right",
        color: colors.textColorWhite,
        fontFamily: "Poppins-Regular",
    },
    logoContainer: {
        position: "relative",
        //backgroundColor: "green",
        paddingTop: 80,
        paddingBottom: 60
    },
    logo: {
        width: "60%",
        resizeMode: "contain",
        alignSelf: "center",
    },
    logoSmallDevices: {
        width: "50%",
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: -40
    },
    symbol: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    loginIconContainer: {
        paddingHorizontal: 80,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    loginIcons: {
        width: 40,
        height: 40,
    },
    footer: {
        //flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 15,
        gap: 5
        //backgroundColor: "green"
    },
    footerText: {
        color: colors.textColorWhite,
        fontFamily: "Poppins-Regular",
    },
    footerLink: {
        color: colors.textColorWhite,
        fontFamily: "Poppins-SemiBold",
    }

})