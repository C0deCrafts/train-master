import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import {useAuth} from "./AuthProvider";
import {Alert} from "react-native";

const AccountSettingContext = createContext({});

export const AccountSettingProvider = ({ children }) => {
    const [showStepsCount, setShowStepsCount] = useState(false);
    const {user, profileImage, handleUpdateProfileImage} = useAuth();

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

    const handleProfileImageChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            try {
                handleUpdateProfileImage(result.assets[0].uri, user.uid);
                console.log("Profilbild erfolgreich aktualisiert.")
            } catch (error) {
                console.log('Error updating profile image:', error);
                Alert.alert('Fehler', 'Beim Aktualisieren des Profilbildes ist ein Fehler aufgetreten, probieren Sie es erneut.');
            }
        }
    };

    return (
        <AccountSettingContext.Provider value={{ showStepsCount, setShowStepsCount, profileImage, handleProfileImageChange }}>
            {children}
        </AccountSettingContext.Provider>
    );
};

export const useAccountSetting = () => useContext(AccountSettingContext);
