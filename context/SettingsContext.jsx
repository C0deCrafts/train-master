import {createContext, useState} from "react";

export const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
    const [showStepsCount, setShowStepsCount] = useState(false);

    return (
        <SettingsContext.Provider value={{ showStepsCount, setShowStepsCount }}>
            {children}
        </SettingsContext.Provider>
    );
}