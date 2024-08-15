import {createContext, useContext, useEffect} from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {router} from "expo-router";

// actually notification is only for ios !!

const NotificationContext = createContext({});

export const useNotificationObserver = () => {
    useEffect(() => {
        let isMounted = true;

        const redirect = (notification) => {
            const url = notification.request.content.data?.url;
            if(url){
                router.push(url );
            }
        }

        Notifications.getLastNotificationResponseAsync().then((response) => {
            if(!isMounted || !response?.notification){
                return;
            }
            redirect(response?.notification)
            console.log("Get last notification response: ", response);
        })

        // Listener für Benutzerinteraktionen mit Benachrichtigungen
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            redirect(response.notification)
            console.log("Add notification response received listener: ", JSON.stringify(response));
        });

        return () => {
            isMounted = false;
            subscription.remove();
        }
    }, []);
}

export const NotificationProvider = ({children}) => {

    const registerForPushNotificationsAsync = async () => {
        let token;

        if (Device.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: Constants?.expoConfig?.extra?.eas?.projectId,
            })).data;
            console.log("TOKEN:", token);
        } else {
            console.log("Must use physical device for Push Notifications");
        }
        return token;
    }

    const localNotification = async (timeLeft, title, body) => {
        //console.log('Scheduling notification with time left:', timeLeft);
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title || "Benachrichtigung",
                body: body || "Eine neue Benachrichtigung ist gekommen",
            },
            trigger: {
                seconds: timeLeft,
            },
        });
    }

    const cancelAllLocalNotifications = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        //console.log('All scheduled notifications cancelled');
    };

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            console.log("FINALLY TOKEN: ", token)
        })
    }, []);

    return <NotificationContext.Provider value={{localNotification, cancelAllLocalNotifications, useNotificationObserver}}>
        {children}
    </NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext);