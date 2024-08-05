import { useEffect, useState } from 'react';
import AppleHealthKit from 'react-native-health';

const permissions = {
    permissions: {
        read: [AppleHealthKit.Constants.Permissions.Steps],
        write: [],
    },
};

const useHealthData = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(null);

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

    useEffect(() => {
        initAppleHealthKit();
    }, []);

    useEffect(() => {
        getSteps();
    }, [hasPermission]);

    return { steps };
};

export default useHealthData;
