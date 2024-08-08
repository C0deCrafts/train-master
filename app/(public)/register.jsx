import {Alert, ImageBackground, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'
import { Image } from 'expo-image';
import {SafeAreaView} from "react-native-safe-area-context";
import {colors, icons, images} from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import {Link} from "expo-router";
import {useEffect, useRef, useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {DEFAULT_PROFILE_IMAGE_URL, FIREBASE_AUTH, FIRESTORE_DB} from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loading, setLoading] = useState(false);
    //const [message, setMessage] = useState('');
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    /*useEffect(() => {
        console.log("PW:: ", password);
        console.log("CPW: ", confirmPassword)
        console.log("PW: ", message);
    }, [password, message, confirmPassword]);*/

    const handleRegistration = async () => {
        try{
            const validationMessage = validatePassword(password,confirmPassword);
            if(!validationMessage) {
                setLoading(true);
                const user = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
                //console.log("Register: ", user)
                await createUserInformation(user)
            } else {
                Alert.alert('‼️Achtung‼️Fehler bei der Registrierung aufgetreten, melde es an den App Betreiber', validationMessage)
            }
        } catch (err) {
            if(err.code === "auth/email-already-in-use"){
                Alert.alert('Bereits registiert!', "Diese E-Mailadresse ist bereits bei uns registiert, bitte logge dich ein!")
            }
            console.log("Register Error: ", err)
        } finally {
            setLoading(false)
        }
    }

    const createUserInformation = async(user, profileImageUri) => {
        try {
            const docRef = doc(FIRESTORE_DB, `users/${user.user.uid}`)
            await setDoc(docRef, {
                username,
                email,
                profileImage: DEFAULT_PROFILE_IMAGE_URL
            });
        } catch (err) {
            console.log("Error DB: ", err)
        }
    }

    const validatePassword = (password, confirmPassword) => {
        let messages = [];

        if (password.length < 8) {
            messages.push("➡️️Dein Passwort muss mindestens 8 Zeichen haben.");
        }
        if (!/[a-zA-Z]/.test(password)) {
            messages.push("➡️️Füge mindestens einen Buchstaben hinzu.");
        }

        if (messages.length > 0) {
            return messages.join(' ');
        } else {
            if (password !== confirmPassword) {
                return("️Die Passwörter stimmen nicht überein. Bitte gib sie erneut ein.");
            }
            return null;
        }
    };

    return (
        <ImageBackground
            source={images.backgroundMale}
            style={styles.container}
        >
            <Image
                source={images.backgroundSymbol}
                style={styles.symbol}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={styles.content}>
                    <Spinner visible={loading}/>
                    <View style={styles.formContainer}>
                        <FormField placeholder="Benutzername"
                                   otherStyles={{marginBottom: 16}}
                                   value={username}
                                   handleChangeText={setUsername}
                                   onSubmitEditing={()=> emailInputRef.current.focus()}
                                   returnKeyType="next"
                        />
                        <FormField placeholder="E-Mail"
                                   otherStyles={{marginBottom: 16}}
                                   value={email}
                                   handleChangeText={setEmail}
                                   ref={emailInputRef}
                                   onSubmitEditing={()=> passwordInputRef.current.focus()}
                                   returnKeyType="next"
                        />
                        <FormField placeholder="Passwort"
                                   isPassword={true}
                                   otherStyles={{marginBottom: 16}}
                                   value={password}
                                   handleChangeText={setPassword}
                                   ref={passwordInputRef}
                                   onSubmitEditing={()=> confirmPasswordInputRef.current.focus()}
                                   returnKeyType="next"
                        />
                        <FormField placeholder="Bestätige Passwort"
                                   isPassword={true}
                                   value={confirmPassword}
                                   handleChangeText={setConfirmPassword}
                                   ref={confirmPasswordInputRef}
                                   onSubmitEditing={()=> handleRegistration()}
                                   returnKeyType="done"
                        />
                        <CustomButton title="Registrieren" containerStyles={{marginTop: 40}} handlePress={handleRegistration} textStyle={{color: colors.white}}/>
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
            </TouchableWithoutFeedback>
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
        contentFit: "contain",
        alignSelf: "center",
    },
    logoSmallDevices: {
        width: "50%",
        contentFit: "contain",
        alignSelf: "center",
        marginBottom: -40
    },
    symbol: {
        position: "absolute",
        width: "100%",
        height: "100%",
        contentFit: "contain",
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