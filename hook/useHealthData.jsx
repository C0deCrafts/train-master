import { useEffect, useState } from 'react';
import AppleHealthKit from 'react-native-health';

const {Permissions} = AppleHealthKit.Constants;

const permissions = {
    permissions: {
        read: [
            Permissions.Steps,
            Permissions.Weight,
        ],
        write: [],
    },
};

const useHealthData = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [weight, setWeight] = useState(null)
    const [steps, setSteps] = useState({});

    useEffect(() => {
        AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
                console.log("Error getting permission", err);
                return;
            }
            setHasPermission(true);
        });
    }, []);

    useEffect(() => {
        if (!hasPermission) {
            return;
        }

        // Query Health data
        const optionWeight = {
            unit: "pound"
        }

        getSteps(new Date());

        AppleHealthKit.getLatestWeight(optionWeight, (err, results) => {
            if(err){
                console.log('Error getting the latest weight: ', err);
                return;
            }
            if (!results || !results.value) {
                console.log('No weight data available');
                setWeight(0);
                return;
            }
            setWeight(convertPoundsToKilograms(results.value));
        })
    }, [hasPermission]);

    const getSteps = (date) => {
        if (!hasPermission) {
            return;
        }

        const options = {
            date: date.toISOString(),
            //includesManuallyAdded: false,
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

    //fix error if user has no apple healh kit

    const convertPoundsToKilograms = (pounds) => {
        const kilograms = pounds * 0.45359237;
        return parseFloat(kilograms.toFixed(2));
    };

    return { steps, getSteps, weight, hasPermission };
};

export default useHealthData;
