import {collection, getDocs, query, where} from "firebase/firestore";
import {FIRESTORE_DB} from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

            // Bild-URLs für die WorkoutId abrufen und speichern
            for (const exercise of exercises) {
                if (exercise.image) {
                    images[exercise.id] = exercise.image;
                }
                if (exercise.video) {
                    videos[exercise.id] = exercise.video;
                }
            }
        }
        return {workouts, images, videos};
    } catch (error) {
        console.error("Error fetching workouts with exercises: ", error);
    }
}

const cacheWorkouts = async (workouts, images, videos) => {
    try {
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

export {fetchWorkoutsWithExercises, cacheWorkouts, loadCachedWorkouts};