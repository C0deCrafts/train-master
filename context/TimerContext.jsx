import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNotifications} from "./NotificationContext";

const TimerContext = createContext({});

//FIX if I close the app - timer for exercise is not correct

const saveTimer = async (timeLeft, endTime) => {
    try {
        await AsyncStorage.setItem('timeLeft', JSON.stringify({ timeLeft, endTime }));
        //console.log('Saved timer:', { timeLeft, endTime });
    } catch (err) {
        console.error('Failed to save timeLeft', err);
    }
};

const loadTimer = async () => {
    try {
        const value = await AsyncStorage.getItem('timeLeft');
        if (value !== null) {
            //console.log('Loaded timer:', timerData);
            return JSON.parse(value);
        }
    } catch (err) {
        console.error('Failed to load timeLeft', err);
    }
    return null;
};

export const TimerProvider = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

    const { localNotification, cancelAllLocalNotifications } = useNotifications();

    const [isAppActive, setIsAppActive] = useState("active");

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            //console.log('AppState changed to', nextAppState);
            setIsAppActive(nextAppState);

            if (nextAppState === 'active') {
                const timerData = await loadTimer();
                if (timerData) {
                    const { endTime } = timerData;
                    const currentTime = new Date().getTime();
                    const calculatedTimeLeft = Math.max(Math.floor((endTime - currentTime) / 1000), 0);
                    setTimeLeft(calculatedTimeLeft);
                    setIsTimerRunning(calculatedTimeLeft > 0);
                    //console.log('App resumed, calculated time left:', calculatedTimeLeft);
                    await cancelAllLocalNotifications();
                }
            } else if (nextAppState.match(/inactive|background/)) {
                if (isTimerRunning) {
                    const currentTime = new Date().getTime();
                    const newEndTime = currentTime + timeLeft * 1000;
                    await saveTimer(timeLeft, newEndTime);
                    await cancelAllLocalNotifications();
                    await localNotification(timeLeft,"Pause beendet","Es ist Zeit dein Training fortzusetzen!💪");
                    //console.log('App moved to background, time left:', timeLeft, 'end time:', newEndTime);
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
                    //console.log('Updating timer, time left:', newTimeLeft);
                    if (newTimeLeft === 0) {
                        setIsTimerRunning(false);
                        //console.log("Timer stopped")
                        //hier auch benachrichtigung scheduleNot??
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
        //console.log('Timer stopped NOW');
    };

    return (
        <TimerContext.Provider value={{ timeLeft, startTimer, stopTimer, isAppActive }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
