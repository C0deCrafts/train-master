import { FIRESTORE_DB } from '../utils/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const fetchExercises = async () => {
    try {
        const exercisesCollection = collection(FIRESTORE_DB, 'exercises');
        const exercisesSnapshot = await getDocs(exercisesCollection);
        exercisesSnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    } catch (error) {
        console.error("Error fetching workouts: ", error);
    }
};

export const fetchWorkouts = async () => {
    try {
        const exercisesCollection = collection(FIRESTORE_DB, 'workouts');
        const exercisesSnapshot = await getDocs(exercisesCollection);
        exercisesSnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    } catch (error) {
        console.error("Error fetching workouts: ", error);
    }
};

export const fetchWorkoutsWithExercises = async () => {
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
        console.log('Workouts with Id:', JSON.stringify(workouts, null, 2));
    } catch (error) {
        console.error("Error fetching workouts with exercises: ", error);
    }
};