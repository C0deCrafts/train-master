import { createContext, useState, useEffect } from 'react';
import { fetchWorkoutsWithExercises } from '../uploadData/fetchExercises';
import {collection, getDocs, query, where} from "firebase/firestore";
import {FIRESTORE_DB} from "../config/firebaseConfig";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const loadWorkouts = async () => {
            await fetchWorkoutsWithExercises(setWorkouts);
        };

        loadWorkouts();
    }, []);

    const fetchWorkoutsWithExercises = async () => {
        try {
            const workoutsCollection = collection(FIRESTORE_DB, 'workouts');
            const workoutsSnapshot = await getDocs(workoutsCollection);

            const workouts = [];

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
            }

            // Ausgabe in der Konsole
            //console.log('Workouts with Id:', JSON.stringify(workouts, null, 2));
            setWorkouts(workouts);
        } catch (error) {
            console.error("Error fetching workouts with exercises: ", error);
        }
    }



    return (
        <WorkoutContext.Provider value={{ workouts }}>
            {children}
        </WorkoutContext.Provider>
    );
};
