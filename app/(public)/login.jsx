import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {colors, icons, images} from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import {Link} from "expo-router";
import { Dimensions } from 'react-native';
import {useEffect, useState} from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {signInWithEmailAndPassword} from "firebase/auth";
import {FIREBASE_AUTH} from "../../config/firebaseConfig";


const Login = () => {
    const [isSmallDevice, setIsSmallDevice] = useState(false)
    const screenHeight = Dimensions.get('window').height;

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try{
            setLoading(true);
            const user = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            //console.log("Login: ", user)
        } catch (err) {
            console.log("Register Error: ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(screenHeight);
        if(screenHeight < 700){
            setIsSmallDevice(true);
        }
    }, [screenHeight]);

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
                    <View style={styles.logoContainer}>
                        {isSmallDevice ? (
                            <Image
                                source={images.logo}
                                style={styles.logoSmallDevices}
                            />
                        ) : (
                            <Image
                                source={images.logo}
                                style={styles.logo}
                            />
                        )}

                    </View>
                    <View style={styles.formContainer}>
                        <FormField placeholder="E-Mail" otherStyles={{marginBottom: 16}} value={email}
                                   handleChangeText={setEmail}/>
                        <FormField placeholder="Passwort" isPassword={true} value={password}
                                   handleChangeText={setPassword}/>
                        <Text style={styles.forgotPasswordText}>Passwort vergessen?</Text>
                        <CustomButton title="Login" containerStyles={{marginTop: 40}} handlePress={handleLogin}/>
                        <Text style={styles.text}>oder</Text>
                        <View style={styles.loginIconContainer}>
                            <Image source={icons.apple} style={styles.loginIcons}/>
                            <Image source={icons.facebook} style={styles.loginIcons}/>
                            <Image source={icons.google} style={styles.loginIcons}/>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Kein Account?</Text>
                        <Link replace href={"/register"} style={styles.footerLink}>{" "}Registriere dich jetzt!</Link>
                    </View>
                </SafeAreaView>
            </ImageBackground>
    );
};

export default Login;

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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: 15,
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