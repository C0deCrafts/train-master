import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled');
};

const scheduleNotification = async (timeLeft) => {
    console.log('Scheduling notification with time left:', timeLeft);
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Pause beendet",
            body: "Es ist Zeit dein Training fortzusetzen!💪",
        },
        trigger: {
            seconds: timeLeft,
        },
    });
};

const saveTimer = async (timeLeft, endTime) => {
    try {
        await AsyncStorage.setItem('timeLeft', JSON.stringify({ timeLeft, endTime }));
        console.log('Saved timer:', { timeLeft, endTime });
    } catch (e) {
        console.error('Failed to save timeLeft', e);
    }
};

const loadTimer = async () => {
    try {
        const value = await AsyncStorage.getItem('timeLeft');
        if (value !== null) {
            const timerData = JSON.parse(value);
            console.log('Loaded timer:', timerData);
            return timerData;
        }
    } catch (e) {
        console.error('Failed to load timeLeft', e);
    }
    return null;
};

const useTimer = (initialTime) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const appState = useRef(AppState.currentState);
    const timerRef = useRef(null);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            console.log('AppState changed from', appState.current, 'to', nextAppState);
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                const timerData = await loadTimer();
                if (timerData) {
                    const { timeLeft, endTime } = timerData;
                    const currentTime = new Date().getTime();
                    const calculatedTimeLeft = Math.max((endTime - currentTime) / 1000, 0);
                    setTimeLeft(calculatedTimeLeft);
                    console.log('App resumed, calculated time left:', calculatedTimeLeft);
                    await cancelAllNotifications();
                }
            } else if (nextAppState.match(/inactive|background/)) {
                const currentTime = new Date().getTime();
                const newEndTime = currentTime + timeLeft * 1000;
                await saveTimer(timeLeft, newEndTime);
                await cancelAllNotifications();
                await scheduleNotification(timeLeft);
                console.log('App moved to background, time left:', timeLeft, 'end time:', newEndTime);
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [timeLeft]);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const newTimeLeft = Math.max(prev - 1, 0);
                console.log('Updating timer, time left:', newTimeLeft);
                return newTimeLeft;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    return timeLeft;
};

export default useTimer;
