import { createContext, useState } from 'react';
import {collection, getDocs, query, where} from "firebase/firestore";
import {FIRESTORE_DB} from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState([]);
    const [exerciseImages, setExerciseImages] = useState({});
    const [exerciseVideos, setExerciseVideos] = useState({});

    const fetchWorkoutsWithExercises = async () => {
        try {
            const workoutsCollection = collection(FIRESTORE_DB, 'workouts');
            const workoutsSnapshot = await getDocs(workoutsCollection);

            const workouts = [];
            const images = {};
            const videos = {}

            for (const workoutDoc of workoutsSnapshot.docs) {
                const workoutData = workoutDoc.data();
                const exerciseIds = workoutData.exercises;

                // Exercise-Dokumente abrufen
                const exercisesCollection = collection(FIRESTORE_DB, 'exercises');
                const q = query(exercisesCollection, where('id', 'in', exerciseIds));
                const exercisesSnapshot = await getDocs(q);
                const exercises = exercisesSnapshot.docs.map(doc => doc.data());

                workouts.push({
                    ...workoutData,
                    exercises
                });

                // Bild-URLs für die Exercises abrufen und speichern
                for (const exercise of exercises) {
                    if (exercise.image) {
                        images[exercise.id] = exercise.image;
                    }
                    if (exercise.video) {
                        videos[exercise.id] = exercise.video;
                    }
                }
            }

            //setExerciseImages(images);
            //setExerciseVideos(videos);
            return {workouts, images, videos};
        } catch (error) {
            console.error("Error fetching workouts with exercises: ", error);
        }
    }

    const cacheWorkouts = async (workouts, images, videos) => {
        try {
            //await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
            await AsyncStorage.multiSet([
                ['workouts', JSON.stringify(workouts)],
                ['exerciseImages', JSON.stringify(images)],
                ['exerciseVideos', JSON.stringify(videos)]
            ]);
        } catch (error) {
            console.error("Error caching workouts: ", error);
        }
    };
    const loadCachedWorkouts = async () => {
        try {
            //const cachedWorkouts = await AsyncStorage.getItem('workouts');
            //return cachedWorkouts ? JSON.parse(cachedWorkouts) : null;
            const [[, cachedWorkouts], [, cachedImages], [, cachedVideos]] = await AsyncStorage.multiGet(['workouts', 'exerciseImages', 'exerciseVideos']);
            return {
                workouts: cachedWorkouts ? JSON.parse(cachedWorkouts) : null,
                images: cachedImages ? JSON.parse(cachedImages) : null,
                videos: cachedVideos ? JSON.parse(cachedVideos) : null,
            };
        } catch (error) {
            console.error("Error loading cached workouts: ", error);
            return null;
        }
    };

    const loadWorkouts = async () => {
        /*const cachedWorkouts = await loadCachedWorkouts();
        if(cachedWorkouts){
            setWorkouts(cachedWorkouts);
        }else {
            const fetchedWorkouts = await fetchWorkoutsWithExercises();
            setWorkouts(fetchedWorkouts);
            await cacheWorkouts(fetchedWorkouts);
        }*/
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


    return (
        <WorkoutContext.Provider value={{ workouts, exerciseImages, exerciseVideos, loadWorkouts }}>
            {children}
        </WorkoutContext.Provider>
    );
};