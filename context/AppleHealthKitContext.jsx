import {createContext, useContext, useEffect, useState} from "react";
import AppleHealthKit from 'react-native-health'

const AppleHealthKitContext = createContext();

const permissions = {
    permissions: {
        read: [AppleHealthKit.Constants.Permissions.Steps],
        write: [],
    },
};

export const AppleHealthKitProvider = ({ children }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [stepCount, setStepCount] = useState(null)
    const [showStepsCount, setShowStepsCount] = useState(false);

    const initAppleHealthKit = () => {
        AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
                console.log("Error getting permission", err);
                return;
            }
            setHasPermission(true);
        });
    }

    const getSteps = () => {
        if (!hasPermission) {
            return;
        }

        const options = {
            date: new Date().toISOString(),
            includesManuallyAdded: false,
        };

        AppleHealthKit.getStepCount(options, (err, results) => {
            if (err) {
                console.log('Error getting the steps: ', err);
                return;
            }
            console.log("Result: ", results.value)
            setStepCount(results.value);
        });
    }

    useEffect(() => {
      initAppleHealthKit();
    }, []);

    useEffect(() => {
        getSteps();
    }, [hasPermission]);

    return (
        <AppleHealthKitContext.Provider value={{ hasPermission, stepCount, showStepsCount, setShowStepsCount }}>
            {children}
        </AppleHealthKitContext.Provider>
    );
}

export const useAppleHealthKit = () => useContext(AppleHealthKitContext);