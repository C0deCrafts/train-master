import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountSettingContext = createContext({});

export const AccountSettingProvider = ({ children }) => {
    const [showStepsCount, setShowStepsCount] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedShowStepsCount = await AsyncStorage.getItem('showStepsCount');
                if (savedShowStepsCount !== null) {
                    setShowStepsCount(JSON.parse(savedShowStepsCount));
                }
            } catch (error) {
                console.error('Error loading settings', error);
            }
        };

        loadSettings();
    }, []);

    useEffect(() => {
        const saveSettings = async () => {
            try {
                await AsyncStorage.setItem('showStepsCount', JSON.stringify(showStepsCount));
            } catch (error) {
                console.error('Error saving settings', error);
            }
        };

        saveSettings();
    }, [showStepsCount]);

    return (
        <AccountSettingContext.Provider value={{ showStepsCount, setShowStepsCount }}>
            {children}
        </AccountSettingContext.Provider>
    );
};

export const useAccountSetting = () => useContext(AccountSettingContext);
