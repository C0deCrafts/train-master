import {createContext, useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {cacheWorkouts, fetchWorkoutsWithExercises, loadCachedWorkouts} from "../utils/workoutUtils";
import {
    completeExercise,
    startTrainingSession
} from "../utils/trainingSession";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState([]);
    const [exerciseImages, setExerciseImages] = useState({});
    const [exerciseVideos, setExerciseVideos] = useState({});
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const [exerciseStartTime, setExerciseStartTime] = useState(null);
    const [setDurations, setSetDurations] = useState([]);

    const loadWorkouts = async () => {
        const { workouts: cachedWorkouts, images: cachedImages, videos: cachedVideos } = await loadCachedWorkouts();
        if (cachedWorkouts && cachedImages && cachedVideos) {
            setWorkouts(cachedWorkouts);
            setExerciseImages(cachedImages);
            setExerciseVideos(cachedVideos);
        } else {
            const { workouts, images, videos } = await fetchWorkoutsWithExercises();
            setWorkouts(workouts);
            setExerciseImages(images);
            setExerciseVideos(videos);
            await cacheWorkouts(workouts, images, videos);
        }
    };

    const startSession = async (workoutId) => {
        const sessionId = await startTrainingSession(workoutId);
        setCurrentSessionId(sessionId);
    }

    const startExerciseTimer = () => {
        const startTime = new Date();
        setExerciseStartTime(startTime);
        console.log(`Exercise timer started at: ${startTime}`);
    };

    const stopExerciseTimer = ()  => {
        if(exerciseStartTime){
            const endTime = new Date();
            const durationInSeconds = (endTime - exerciseStartTime) / 1000; // Dauer in Sekunden
            setSetDurations(prevDurations => [...prevDurations, durationInSeconds]);

            console.log(`Exercise timer stopped at: ${endTime}`);
            console.log(`Exercise duration: ${durationInSeconds} seconds`);
            setExerciseStartTime(null); // Timer zurücksetzen
        } else {
            console.log("No timer started")
        }
    };

    const completeCurrentExercise = async (exercise) => {
        if (!currentSessionId) {
            throw new Error("No active training session");
        }

        setSetDurations(async prevDurations => {
            const totalDuration = prevDurations.reduce((acc, duration) => acc + duration, 0);

            const completedExercise = {
                ...exercise,
                duration: totalDuration,
                test: prevDurations.length,
            };

            //console.log("Duration der einzelnen Sätze: ", prevDurations);
            //console.log("Summe TotalDuration: ", totalDuration);
            //console.log("Es wurden soviele Sätze gespeichert: " + prevDurations.length + " von: " + exercise.sets + " Sets");

            await completeExercise(currentSessionId, completedExercise).then(() => {
                setSetDurations([]);
                console.log("Exercise completed and durations reset");
            });
        });
    }

    //for testing (later need a listener to the database)
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Alle Daten im AsyncStorage wurden gelöscht.');
        } catch (error) {
            console.error('Fehler beim Löschen der Daten im AsyncStorage:', error);
        }
    };

    /*useEffect(() => {
        console.log("CurrentSetDurations: ", setDurations)
    }, [setDurations]);*/

    /*useEffect(() => {
        console.log("SessionId: ", JSON.stringify(currentSessionId));
    }, [currentSessionId]);*/

    return (
        //setDurations
        <WorkoutContext.Provider value={{ workouts, clearStorage, exerciseImages, exerciseVideos, loadWorkouts, startSession, startExerciseTimer, stopExerciseTimer, completeCurrentExercise }}>
            {children}
        </WorkoutContext.Provider>
    );
};
