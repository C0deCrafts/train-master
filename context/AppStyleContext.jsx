import {createContext, useContext, useEffect, useState} from "react";
import {large_default, medium, small, xLarge, xSmall, xxLarge, fontFamily} from "../constants/textStyles";
import {color, dark, light} from "../constants/colors";
import {useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";

const AppStyleContext = createContext({});

const textStyles = {
    xSmall,
    small,
    medium,
    large_default,
    xLarge,
    xxLarge,
}

export const AppStyleProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState(systemColorScheme);
    const [customColors, setCustomColors] = useState({
        baseColor: colorScheme === "light" ? light.baseColor : dark.baseColor,
        colorButtonLabel: "rgb(255,255,255)"
    });
    const [textSize, setTextSize] = useState("large_default");

    useEffect(() => {
        setColorScheme(systemColorScheme);
    }, [systemColorScheme]);

    const isColorDark = (color) => { // neu
        const darkColors = [
            light.baseColor, light.red, light.green, light.mint_2, light.teal, light.teal_2, light.cyan_2, light.blue, light.indigo, light.indigo_2, light.purple, light.purple_2, light.pink, light.pink_2,
            dark.baseColor, dark.red, dark.green, dark.mint_2, dark.teal, dark.teal_2, dark.cyan_2, dark.blue, dark.indigo, dark.indigo_2, dark.purple, dark.purple_2, dark.pink, dark.pink_2
            ];
        return darkColors.includes(color);

    };

    const getColors = () => {
        const baseColors = colorScheme === "light" ? light : dark;
        return { ...baseColors, ...customColors };
    };

    const getAllBaseColors = () => {
        return { ...light, ...dark }; // Extrahiert alle Farbwerte aus light und dark
    };

    const getTextStyles = () => textStyles[textSize] || textStyles.large_default;

    const updateBaseColor = (newBaseColor) => {
        const newButtonLabelColor = isColorDark(newBaseColor) ? "rgb(255,255,255)" : "rgb(0,0,0)";
        setCustomColors(prevColors => ({
            ...prevColors,
            baseColor: newBaseColor,
            colorButtonLabel: newButtonLabelColor
        }));
    };

    useEffect(() => {
        console.log("TextSize: ", textSize)
        console.log("Get: ", getTextStyles())
    }, [textSize]);


    /*const determineButtonLabelColor = (backgroundColor) => {
        const darkBackgroundColors = [
            dark.red,
            dark.green,
            dark.blue,
            dark.indigo,
            dark.indigo_2,
            dark.purple,
            dark.purple_2,
            dark.pink,
            dark.pink_2,
            dark.brown,
            dark.gray_4,
            dark.gray_5,
            dark.gray_6,
            dark.primary
        ];
        return darkBackgroundColors.includes(backgroundColor) ? light.colorButtonLabel : dark.colorButtonLabel
    }*/

    return (
        <AppStyleContext.Provider value={{
            textSize, setTextSize, getTextStyles, getColors, getAllBaseColors,
            colorScheme, setColorScheme, updateBaseColor, fontFamily
        }}>
            {children}
        </AppStyleContext.Provider>
    );
};

export const useAppStyle = () => useContext(AppStyleContext);