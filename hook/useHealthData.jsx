import { useEffect, useState } from 'react';
import AppleHealthKit from 'react-native-health';

const permissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.Weight,
        ],
        write: [],
    },
};

const useHealthData = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(null);
    const [weight, setWeight] = useState(null)

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
            setSteps(results.value);
        });
    }

    const getWeight = () => {
        if (!hasPermission) {
            return;
        }

        const options = {
            unit: "pound"
        }

        AppleHealthKit.getLatestWeight(options, (err, results) => {
            if(err){
                console.log('Error getting the latest weight: ', err);
                return;
            }
            if (!results || !results.value) {
                console.log('No weight data available');
                setWeight(null);
                return;
            }

            setWeight(convertPoundsToKilograms(results.value));
        })
    }

    const convertPoundsToKilograms = (pounds) => {
        const kilograms = pounds * 0.45359237;
        return parseFloat(kilograms.toFixed(2));
    };


    useEffect(() => {
        initAppleHealthKit();
    }, []);

    useEffect(() => {
        getSteps();
        getWeight();
    }, [hasPermission]);

    return { steps, weight };
};

export default useHealthData;
