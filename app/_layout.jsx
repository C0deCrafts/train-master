import {AuthProvider, useAuth} from "../context/AuthProvider";
import {Slot, SplashScreen, useRouter, useSegments} from "expo-router";
import {useContext, useEffect, useState} from "react";
import {ActivityIndicator, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useFonts} from "expo-font";
import {AppStyleProvider} from "../context/AppStyleContext";
import {WorkoutContext, WorkoutProvider} from "../context/WorkoutContext";

const InitialLayout = () => {
    const {user, initialized, username} = useAuth();
    const { loadWorkouts } = useContext(WorkoutContext);
    const router = useRouter();
    const segments = useSegments();
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);
    const [userInfoLoaded, setUserInfoLoaded] = useState(false);

    useEffect(() => {
        const handleLoadingData = async () => {
            if (!initialized) return;
            const inAuthGroup = segments[0] === "(auth)";

            if (user && !inAuthGroup) {
                setLoadingWorkouts(true)
                await loadWorkouts(); // Warten bis loadWorkouts abgeschlossen ist
                setLoadingWorkouts(false);
                //router.replace("/home");
            } else if (!user) {
                router.navigate("/login");
            }
        };
        handleLoadingData();
    }, [initialized, user]);

    useEffect(() => {
        // Warte, bis die Benutzerinformationen geladen sind
        if (username) {
            setUserInfoLoaded(true);
        }
    }, [username]);

    useEffect(() => {
        if (initialized && !loadingWorkouts && user && username) {
            router.replace("/home");
        }
    }, [initialized, loadingWorkouts, user, username]);

    if (!initialized || loadingWorkouts || (!username && user)) {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#185360"/>
            </View>
        );
    }

    return (
        <>
            {initialized && <Slot/>}
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
                <WorkoutProvider>
                    <InitialLayout/>
                    <StatusBar style="light"/>
                </WorkoutProvider>
            </AuthProvider>
        </AppStyleProvider>
    )
}

export default RootLayout;
