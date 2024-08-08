import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const TimerContext = createContext({});

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

export const TimerProvider = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

    const [isAppActive, setIsAppActive] = useState("active");

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            console.log('AppState changed to', nextAppState);
            setIsAppActive(nextAppState);

            if (nextAppState === 'active') {
                const timerData = await loadTimer();
                if (timerData) {
                    const { endTime } = timerData;
                    const currentTime = new Date().getTime();
                    const calculatedTimeLeft = Math.max(Math.floor((endTime - currentTime) / 1000), 0);
                    setTimeLeft(calculatedTimeLeft);
                    setIsTimerRunning(calculatedTimeLeft > 0);
                    console.log('App resumed, calculated time left:', calculatedTimeLeft);
                    await cancelAllNotifications();
                }
            } else if (nextAppState.match(/inactive|background/)) {
                if (isTimerRunning) {
                    const currentTime = new Date().getTime();
                    const newEndTime = currentTime + timeLeft * 1000;
                    await saveTimer(timeLeft, newEndTime);
                    await cancelAllNotifications();
                    await scheduleNotification(timeLeft);
                    console.log('App moved to background, time left:', timeLeft, 'end time:', newEndTime);
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [timeLeft, isTimerRunning]);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    const newTimeLeft = Math.max(Math.floor(prev - 1), 0);
                    console.log('Updating timer, time left:', newTimeLeft);
                    if (newTimeLeft === 0) {
                        setIsTimerRunning(false);
                        console.log("Timer stopped")
                    }
                    return newTimeLeft;
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [isTimerRunning]);

    const startTimer = (initialTime) => {
        setTimeLeft(Math.floor(initialTime));
        setIsTimerRunning(true);
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
        clearInterval(timerRef.current);
        setTimeLeft(0)
        console.log('Timer stopped NOW');
    };

    return (
        <TimerContext.Provider value={{ timeLeft, startTimer, stopTimer, isAppActive }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
