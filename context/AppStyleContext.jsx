import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { large_default, medium, small, xLarge, xSmall, xxLarge, fontFamily } from '../constants/textStyles';
import { dark, light } from '../constants/colors';

const AppStyleContext = createContext({});

const textStyles = {
    xSmall,
    small,
    medium,
    large_default,
    xLarge,
    xxLarge,
};

export const AppStyleProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState(systemColorScheme);
    const [customColors, setCustomColors] = useState({
        baseColor: colorScheme === 'light' ? light.baseColor : dark.baseColor,
        colorButtonLabel: 'rgb(255,255,255)',
    });
    const [textSize, setTextSize] = useState('large_default');

    useEffect(() => {
        const loadStyles = async () => {
            try {
                const savedColorScheme = await AsyncStorage.getItem('colorScheme');
                if (savedColorScheme !== null) {
                    setColorScheme(savedColorScheme);
                }

                const savedCustomColors = await AsyncStorage.getItem('customColors');
                if (savedCustomColors !== null) {
                    setCustomColors(JSON.parse(savedCustomColors));
                }

                const savedTextSize = await AsyncStorage.getItem('textSize');
                if (savedTextSize !== null) {
                    setTextSize(savedTextSize);
                }
            } catch (error) {
                console.error('Error loading styles', error);
            }
        };
        loadStyles();
    }, []);

    useEffect(() => {
        const saveStyles = async () => {
            try {
                await AsyncStorage.setItem('colorScheme', colorScheme);
                await AsyncStorage.setItem('customColors', JSON.stringify(customColors));
                await AsyncStorage.setItem('textSize', textSize);
            } catch (error) {
                console.error('Error saving styles', error);
            }
        };
        saveStyles();
    }, [colorScheme, customColors, textSize]);

    const isColorDark = (color) => {
        const darkColors = [
            light.baseColor, light.red, light.green, light.mint_2, light.teal, light.teal_2, light.cyan_2, light.blue, light.indigo, light.indigo_2, light.purple, light.purple_2, light.pink, light.pink_2,
            dark.baseColor, dark.red, dark.green, dark.mint_2, dark.teal, dark.teal_2, dark.cyan_2, dark.blue, dark.indigo, dark.indigo_2, dark.purple, dark.purple_2, dark.pink, dark.pink_2,
        ];
        return darkColors.includes(color);
    };

    const getColors = () => {
        const baseColors = colorScheme === 'light' ? light : dark;
        return { ...baseColors, ...customColors };
    };

    const getAllBaseColors = () => ({ ...light, ...dark });

    const getTextStyles = () => textStyles[textSize] || textStyles.large_default;

    const updateBaseColor = (newBaseColor) => {
        const newButtonLabelColor = isColorDark(newBaseColor) ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
        setCustomColors((prevColors) => ({
            ...prevColors,
            baseColor: newBaseColor,
            colorButtonLabel: newButtonLabelColor,
        }));
    };

    return (
        <AppStyleContext.Provider value={{
            textSize, setTextSize, getTextStyles, getColors, getAllBaseColors,
            colorScheme, setColorScheme, updateBaseColor, fontFamily,
        }}>
            {children}
        </AppStyleContext.Provider>
    );
};

export const useAppStyle = () => useContext(AppStyleContext);
