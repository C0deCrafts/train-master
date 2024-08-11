import {Alert, ImageBackground, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'
import { Image } from 'expo-image';
import {SafeAreaView} from "react-native-safe-area-context";
import {colors, icons, images} from "../../constants";
import CustomButton from "../../components/CustomButton";
import {Link} from "expo-router";
import {useRef, useState} from "react";
import Loading from "../../components/Loading";
import {useAuth} from "../../context/AuthContext";
import FormField from "../../components/FormField";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const {register} = useAuth();

    //to mark the fields if press enter on the keyboard
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null)

    const handleRegister = async () => {
        if(!email || !password || !username) {
            Alert.alert("Registrieren", "Bitte fülle alle Felder aus!")
            return;
        }
        if(password !== confirmPassword) {
            Alert.alert("Passwort", "Die Passwörter stimmen nicht überein. Bitte gib sie erneut ein!")
            return;
        }
        setLoading(true);

        let response = await register(email, password, username);
        setLoading(false);

        console.log("Response from Firebase: ", response);

        if(!response.success){
            Alert.alert(response.message[0], response.message[1])
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={styles.content}>
                    {/* <Spinner visible={loading}/>*/}
                    <Loading visible={loading} color={colors.white} />
                    <View style={styles.formContainer}>
                        <FormField placeholder="Benutzername"
                                   otherStyles={{marginBottom: 16}}
                                   value={username}
                                   handleChangeText={setUsername}
                                   onSubmitEditing={()=> emailRef.current.focus()}
                                   returnKeyType="next"
                        />
                        <FormField placeholder="E-Mail"
                                   otherStyles={{marginBottom: 16}}
                                   value={email}
                                   handleChangeText={setEmail}
                                   ref={emailRef}
                                   onSubmitEditing={()=> passwordRef.current.focus()}
                                   returnKeyType="next"
                        />
                        <FormField placeholder="Passwort"
                                   isPassword={true}
                                   otherStyles={{marginBottom: 16}}
                                   value={password}
                                   handleChangeText={setPassword}
                                   ref={passwordRef}
                                   onSubmitEditing={()=> confirmPasswordRef.current.focus()}
                                   returnKeyType="next"
                        />
                        <FormField placeholder="Bestätige Passwort"
                                   isPassword={true}
                                   value={confirmPassword}
                                   handleChangeText={setConfirmPassword}
                                   ref={confirmPasswordRef}
                                   onSubmitEditing={()=> handleRegister()}
                                   returnKeyType="done"
                        />
                        <CustomButton title="Registrieren" containerStyles={{marginTop: 40}} handlePress={handleRegister} textStyle={{color: colors.white}}/>
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
        //justifyContent: "center",
        paddingHorizontal: 20,
        //paddingTop: 20,
        //backgroundColor: "red"
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