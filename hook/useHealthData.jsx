import {useEffect, useState} from 'react';
import AppleHealthKit from 'react-native-health';

const {Permissions} = AppleHealthKit.Constants;

const getAuthStatus = async (permissions) => {
    return new Promise((resolve, reject) => {
        AppleHealthKit.getAuthStatus(permissions, (err, results) => {
            if (err) {
                console.log("Error permission Health: ",err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

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
    const [weight, setWeight] = useState(0)
    const [steps, setSteps] = useState({});

    // ask user for AppleHealth permission
    const requestPermission = () => {
        return new Promise((resolve, reject) => {
            AppleHealthKit.initHealthKit(permissions, (err) => {
                if (err) {
                    console.log("Error getting permission", err);
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    };

    const getWeight = async () => {
        // Query Health data
        const result = await getAuthStatus(permissions);
        //console.log("Has Permission", result);
        console.log("Has Permission for weight: ", result.permissions.read[1]);

        if(result.permissions?.read[1] == 1){
            const optionWeight = {
                unit: "pound"
            }
            AppleHealthKit.getLatestWeight(optionWeight, (err, results) => {
                if (err) {
                    console.log('Error getting the latest weight: ', err);
                    return;
                }
                if (!results || !results.value) {
                    console.log('No weight data available');
                    setWeight(0);
                    return;
                }
                console.log("Weight value: ", results.value);
                setWeight(convertPoundsToKilograms(results.value));
                //console.log("Weight gesetzt: ", weight)
            })
        } else {
            return;
        }
    }

    const getSteps = async (date) => {
        const result = await getAuthStatus(permissions);
        console.log("Has Permission for steps", result.permissions.read[0]);

        if(result.permissions?.read[0] == 1){
            const options = {
                date: date.toISOString(),
            };
            AppleHealthKit.getStepCount(options, (err, results) => {
                if (err) {
                    console.log('Error getting the steps: ', err);
                    return;
                }
                console.log("Steps value: ", results.value);
                setSteps(prevSteps => ({
                    ...prevSteps,
                    [date.toISOString().split('T')[0]]: results.value
                }));
                //console.log("Steps gesetzt: ", steps);
            });
        } else {
            return;
        }
    }

    //fix error if user has no apple healh kit

    // useEffect to log weight whenever it changes
    useEffect(() => {
        if (weight !== 0 || undefined) {
            console.log("Weight gesetzt: ", weight);
        }
    }, [weight]);

    // useEffect to log weight whenever it changes
    useEffect(() => {
        //console.log("Value of Steps: ", Object.keys(steps).length)
        if (Object.keys(steps).length !== 0 || undefined) {
            console.log("Steps gesetzt: ", steps);
        }
    }, [steps]);

    const convertPoundsToKilograms = (pounds) => {
        const kilograms = pounds * 0.45359237;
        return parseFloat(kilograms.toFixed(2));
    };

    return {steps, getSteps, weight, getWeight, requestPermission};
};

export default useHealthData;
