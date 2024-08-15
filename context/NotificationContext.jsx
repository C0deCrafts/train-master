import {createContext, useContext, useEffect, useRef, useState} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from 'expo-constants';

const NotificationContext = createContext({});

// HINWEIS:
// Lokale Benachrichtigungen: Können auf Simulatoren und Emulatoren getestet werden.

// Push-Benachrichtigungen: Erfordern ein physisches Gerät für die vollständige Funktionalität
// und das Testen, insbesondere wenn sie von einem Server gesendet werden. (Firebase)

// Lokale Benachrichtigungen: Diese werden direkt auf dem Gerät geplant und ausgelöst.
// Sie erfordern keine Internetverbindung und sind nützlich für zeitgesteuerte Erinnerungen und ähnliche Anwendungsfälle.

// Push-Benachrichtigungen: Diese werden von einem externen Server über den Expo Push Notification Service
// gesendet und erfordern eine Internetverbindung. Sie sind nützlich für Benachrichtigungen, die von externen
// Ereignissen abhängen, wie z.B. neue Nachrichten in einer Chat-App.

export const NotificationProvider = ({ children }) => {
    /*
    * Das Expo Push Token wird benötigt, um Push-Benachrichtigungen an das spezifische Gerät zu senden.
    * Wenn man eine Push-Benachrichtigung von einem Server senden möchte, benötigt man dieses Token, um das Gerät zu identifizieren.
    */
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    /*
    * Dies ist eine Referenz für den Listener, der auf eingehende Benachrichtigungen hört.
    * Diese Referenz speichert den Listener für eingehende Benachrichtigungen, sodass er bei Bedarf entfernt werden kann, um Speicherlecks zu vermeiden.
    */
    const notificationListener = useRef();
    /*
    * Dies ist eine Referenz für den Listener, der auf Benutzerinteraktionen mit Benachrichtigungen hört.
    * Diese Referenz speichert den Listener für Benachrichtigungsantworten
    * (z.B. wenn der Benutzer auf eine Benachrichtigung klickt), sodass er bei Bedarf entfernt werden kann.
    */
    const responseListener = useRef();

    //for testing
    useEffect(() => {
        console.log("TOKEN: ", expoPushToken)
    }, [expoPushToken]);

    useEffect(() => {
        // Registriere das Gerät für Push-Benachrichtigungen und speichere das Token
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ""))
            .catch(err => console.log("Error register push nots:" ,err));

        // Listener für eingehende Benachrichtigungen
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            //zusätzlich
            setUnreadCount(prevCount => prevCount + 1); // Anzahl der ungelesenen Nachrichten erhöhen
            setBadgeCount(unreadCount + 1);
        });

        /* //Not in use because App runs only on ios actually
         *
         * if (Platform.OS === 'android') {
         *       Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
         *     }
         *     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
         *       setNotification(notification);
         *     });
         */

        // Listener für Benutzerinteraktionen mit Benachrichtigungen
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
            //zusätzlich
            setUnreadCount(prevCount => Math.max(prevCount - 1, 0)); // Anzahl der ungelesenen Nachrichten verringern
            setBadgeCount(Math.max(unreadCount - 1, 0));
        });

        // Bereinigen der Listener, wenn die Komponente unmontiert wird
        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
        //evtl [] und setBadgeCount weg ??
    }, [unreadCount]);

    // Funktion zum Zurücksetzen der Anzahl ungelesener Nachrichten
    const clearUnreadCount = () => {
        setUnreadCount(0);

        setBadgeCount(0);
    };

    // for server notifications
    async function sendPushNotification(expoPushToken, title, body, data = {}) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: title || "Benachrichtigung",
            body: body || "Eine neue Benachrichtigung ist gekommen",
            data: data // { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    const registerForPushNotificationsAsync = async () => {
        /* //Not in use because App runs only on ios actually
        *  if (Platform.OS === 'android') {
        * await Notifications.setNotificationChannelAsync('default', {
        *   name: 'default',
        *   importance: Notifications.AndroidImportance.MAX,
        *   vibrationPattern: [0, 250, 250, 250],
        *   lightColor: '#FF231F7C',
        *   });
        * }
        */

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
            // EAS projectId is used here.

            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                console.error('Project ID not found');
                return; //new
            }

            try {
                const token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log('Expo Push Token:', token); // Dies ist hilfreich zum Debuggen
                return token;
            } catch (err) {
                console.error('Failed to get push token:', err);
            }
        } else {
            alert('Must use physical device for Push Notifications');
        }
    };

    // for local notifications
    const scheduleNotification = async (timeLeft, title, body) => {
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
    };

    const cancelAllNotifications = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        //console.log('All scheduled notifications cancelled');
    };

    const setBadgeCount = async (count) => {
        await Notifications.setBadgeCountAsync(count);
    };

    return <NotificationContext.Provider value={{sendPushNotification, expoPushToken, notification, unreadCount, clearUnreadCount, scheduleNotification, cancelAllNotifications, setBadgeCount}}>
        {children}
    </NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext);