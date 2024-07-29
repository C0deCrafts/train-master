import {AuthProvider, useAuth} from "../context/AuthProvider";
import {Slot, SplashScreen, useRouter, useSegments} from "expo-router";
import {useEffect} from "react";
import {ActivityIndicator, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useFonts} from "expo-font";
import {AppStyleProvider} from "../context/AppStyleContext";

const InitialLayout = () => {
    const {user, initialized} = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!initialized) return;
        //console.log("Segments: ", segments)
        const inAuthGroup = segments[0] === "(auth)";

        if (user && !inAuthGroup) {
            router.replace("/home");
        } else if (!user) {
            router.navigate("/login");
        }
    }, [initialized, user]);

    return (
        <>
            {initialized ? (
                <Slot/>
            ) : (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#185360"/>
                </View>
            )}
        </>
    )
};

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
        "Jura-Regular": require("../assets/fonts/Jura-Regular.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) return null;

    return (
        <AppStyleProvider>
            <AuthProvider>
                <InitialLayout/>
                <StatusBar style="light"/>
            </AuthProvider>
        </AppStyleProvider>
    )
}

export default RootLayout;
