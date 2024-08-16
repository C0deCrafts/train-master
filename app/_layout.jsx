import {AuthContextProvider, useAuth} from "../context/AuthContext";
import {Slot, useRouter, useSegments} from "expo-router";
import {useEffect} from "react";
import {StatusBar} from "expo-status-bar";
import {useFonts} from "expo-font";
import {AppStyleProvider, useAppStyle} from "../context/AppStyleContext";
import {useWorkout, WorkoutProvider} from "../context/WorkoutContext";
import {AccountSettingProvider} from "../context/AccountSettingContext";
import * as Notifications from "expo-notifications";
import {TimerProvider} from "../context/TimerContext";
import {dark} from "../constants/colors";
import {NotificationProvider, useNotificationObserver} from "../context/NotificationContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";

// Setup notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
    }),
});

/*const requestNotificationPermissions = async () => {
    const {status} = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Erlaubnis für Benachrichtigungen wurde nicht gewährt.');
    }
};*/

const MainLayout = () => {
    const {isAuthenticated, isAppReady} = useAuth();
    const {loadWorkouts} = useWorkout();
    const segments = useSegments();
    const router = useRouter();

    /*useEffect(() => {
        console.log("App ready? ", isAppReady)
    }, [isAppReady]);*/

    useEffect(() => {
        // check if app is ready or not
        const handleLoadingData = async () => {
            if (!isAppReady) return;

            //console.log("App is ready");
            //console.log("Segments: ", segments);
            //console.log("isAuthenticated: ", isAuthenticated);

            //console.log("Segments: ", segments[0])
            const inAuthGroup = segments[0] === "(auth)";

            //console.log("Is in (auth): ",inAuthGroup)
            if (isAuthenticated && !inAuthGroup) {
                //redirect to home
                //console.log("User is authenticated, loading workouts");
                await loadWorkouts();
                router.replace("/(tabs)/(homes)/home");
                //console.log("Redirecting to /home");
                //console.log("CanGoBack? ", router.canGoBack())

            } else if (isAuthenticated === false) {
                //redirect to sign in
                //console.log("User is not authenticated, redirecting to login");
                router.replace("(public)/login");
                //console.log("Redirecting to /login");
                //console.log("CanGoBack? ", router.canGoBack())
            }
        }
        handleLoadingData();
    }, [isAuthenticated, isAppReady]);

    if (!isAppReady) return;

    return <Slot/>;

};
const RootLayout = () => {
    const {colorScheme} = useAppStyle();
    useNotificationObserver();

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

    /*useEffect(() => {
        requestNotificationPermissions();
    }, []);*/

    if (!fontsLoaded && !error) return null;

    //NotProv
    return (
            <NotificationProvider>
                <AppStyleProvider>
                    <AuthContextProvider>
                        <WorkoutProvider>
                            <AccountSettingProvider>
                                <TimerProvider>
                                    <GestureHandlerRootView style={{ flex: 1 }}>
                                        <MainLayout/>
                                        <StatusBar style={colorScheme === dark || "dark" ? "dark" : "light"}/>
                                        {/*<StatusBar style="light"/>*/}
                                    </GestureHandlerRootView>
                                </TimerProvider>
                            </AccountSettingProvider>
                        </WorkoutProvider>
                    </AuthContextProvider>
                </AppStyleProvider>
            </NotificationProvider>
    )
}

export default RootLayout;
