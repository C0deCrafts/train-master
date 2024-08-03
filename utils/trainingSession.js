import {collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc} from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

// Start a new training session
const startTrainingSession = async (workoutId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is logged in");
    }

    const trainingSession = {
        userId: user.uid,
        workoutId: workoutId,
        exercisesCompleted: [],
        totalDuration: 0,
        totalCalories: 0,
        date: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(FIRESTORE_DB, 'trainingSessions'), trainingSession);
    return docRef.id;
};

// Fetch all training sessions for the logged-in user
const fetchTrainingSessions = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is logged in");
    }

    const sessionsCollection = collection(FIRESTORE_DB, 'trainingSessions');
    const q = query(sessionsCollection, where('userId', '==', user.uid));
    const sessionsSnapshot = await getDocs(q);

    const sessions = sessionsSnapshot.docs.map(doc => doc.data());
    return sessions;
};

// Complete an exercise
const completeExercise = async (trainingSessionId, completedExercise) => {
    const sessionRef = doc(FIRESTORE_DB, 'trainingSessions', trainingSessionId);
    const sessionDoc = await getDoc(sessionRef);
    const sessionData = sessionDoc.data();

    sessionData.exercisesCompleted.push(completedExercise);
    sessionData.totalDuration += completedExercise.duration;
    sessionData.totalCalories += completedExercise.caloriesBurned;

    await updateDoc(sessionRef, sessionData);
};


export {startTrainingSession, fetchTrainingSessions, completeExercise};