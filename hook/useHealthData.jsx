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
    const [weight, setWeight] = useState(null)
    const [steps, setSteps] = useState({});

    //fix error if user has no apple healh kit

    const initAppleHealthKit = () => {
        AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
                console.log("Error getting permission", err);
                return;
            }
            setHasPermission(true);
        });
    }

    const getSteps = (date) => {
        if (!hasPermission) {
            return;
        }

        const options = {
            date: date.toISOString(),
            includesManuallyAdded: false,
        };

        AppleHealthKit.getStepCount(options, (err, results) => {
            if (err) {
                console.log('Error getting the steps: ', err);
                return;
            }
            setSteps(prevSteps => ({
                ...prevSteps,
                [date.toISOString().split('T')[0]]: results.value
            }));
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
        if(hasPermission) {
            getSteps(new Date());
            getWeight();
        }
    }, [hasPermission]);

    useEffect(() => {
        //console.log("STEPS: ", steps)
    }, [steps]);

    return { steps, getSteps, weight };
};

export default useHealthData;
