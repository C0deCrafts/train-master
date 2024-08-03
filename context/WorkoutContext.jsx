import {createContext, useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {cacheWorkouts, fetchWorkoutsWithExercises, loadCachedWorkouts} from "../utils/workoutUtils";
import {completeExercise, fetchTrainingSessions, startTrainingSession} from "../utils/trainingSession";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState([]);
    const [exerciseImages, setExerciseImages] = useState({});
    const [exerciseVideos, setExerciseVideos] = useState({});
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [trainingSessions, setTrainingSessions] = useState([]);

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

    const loadTrainingSessions = async () => {
        const sessions = await fetchTrainingSessions();
        setTrainingSessions(sessions)
    }

    const startSession = async (workoutId) => {
        const sessionId = await startTrainingSession(workoutId);
        setCurrentSessionId(sessionId);
    }

    const completeCurrentExercise = async (exercise) => {
        if(!currentSessionId) {
            throw new Error("No active training session");
        }
        await completeExercise(currentSessionId, exercise);
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

    useEffect(() => {
        console.log("TrainingSession: ", JSON.stringify(trainingSessions));
        console.log("SessionId: ", JSON.stringify(currentSessionId));
    }, [trainingSessions, currentSessionId]);

    /*useEffect(() => {
        console.log("Workouts: ", JSON.stringify(workouts, null, 2));
    }, [workouts]);*/

    return (
        <WorkoutContext.Provider value={{ workouts, clearStorage, exerciseImages, exerciseVideos, loadWorkouts, startSession, completeCurrentExercise, loadTrainingSessions }}>
            {children}
        </WorkoutContext.Provider>
    );
};
