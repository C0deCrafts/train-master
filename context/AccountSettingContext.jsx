import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {images} from "../constants";
import * as ImagePicker from "expo-image-picker";

const AccountSettingContext = createContext({});

export const AccountSettingProvider = ({ children }) => {
    const [showStepsCount, setShowStepsCount] = useState(false);
    const [profileImage, setProfileImage] = useState(images.avatar);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedShowStepsCount = await AsyncStorage.getItem('showStepsCount');
                const savedProfileImage = await AsyncStorage.getItem('profileImage');

                if (savedShowStepsCount !== null) {
                    setShowStepsCount(JSON.parse(savedShowStepsCount));
                }
                if (savedProfileImage !== null) {
                    setProfileImage(JSON.parse(savedProfileImage));
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
                if (profileImage) {
                    await AsyncStorage.setItem('profileImage', JSON.stringify(profileImage));
                }
            } catch (error) {
                console.error('Error saving settings', error);
            }
        };

        saveSettings();
    }, [showStepsCount, profileImage]);

    const handleProfileImageChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage({ uri: result.assets[0].uri });
        } else {
            console.log("Kein Bild ausgewählt")
        }
    };

    return (
        <AccountSettingContext.Provider value={{ showStepsCount, setShowStepsCount, profileImage, handleProfileImageChange }}>
            {children}
        </AccountSettingContext.Provider>
    );
};

export const useAccountSetting = () => useContext(AccountSettingContext);
