import {AuthProvider, useAuth} from "../context/AuthProvider";
import {Slot, SplashScreen, useRouter, useSegments} from "expo-router";
import {useContext, useEffect, useState} from "react";
import {ActivityIndicator, Alert, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useFonts} from "expo-font";
import {AppStyleProvider, useAppStyle} from "../context/AppStyleContext";
import {WorkoutContext, WorkoutProvider} from "../context/WorkoutContext";
import {dark} from "../constants/colors";
import {AccountSettingProvider} from "../context/AccountSettingContext";
import {registerBackgroundTask, unregisterBackgroundTask} from "../utils/backgroundTimer";
import * as Notifications from "expo-notifications";

// Setup notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Erlaubnis für Benachrichtigungen wurde nicht gewährt.');
    }
};

const InitialLayout = () => {
    const {user, initialized, username} = useAuth();
    const { loadWorkouts } = useContext(WorkoutContext);
    const router = useRouter();
    const segments = useSegments();
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);

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
        if (initialized && !loadingWorkouts && user && username) {
            router.replace("/(tabs)/(homes)/home");
            //console.log("CanGoBack? ", router.canGoBack)
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
    const {colorScheme} = useAppStyle();

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
        requestNotificationPermissions();
        registerBackgroundTask();
    }, []);

    if (!fontsLoaded && !error) return null;

    return (
        <AppStyleProvider>
            <AuthProvider>
                <WorkoutProvider>
                    <AccountSettingProvider>
                        <InitialLayout/>
                        <StatusBar style={colorScheme === dark || "dark" ? "dark" : "light"}/>
                        {/*<StatusBar style="light"/>*/}
                    </AccountSettingProvider>
                </WorkoutProvider>
            </AuthProvider>
        </AppStyleProvider>
    )
}

export default RootLayout;
