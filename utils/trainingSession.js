import {collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, deleteDoc} from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

// Start a new training session
const startTrainingSession = async (workoutId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is logged in");
    }

    // Check for existing empty sessions
    const sessionsCollection = collection(FIRESTORE_DB, 'trainingSessions');
    const q = query(sessionsCollection, where('userId', '==', user.uid));
    const sessionsSnapshot = await getDocs(q);

    sessionsSnapshot.forEach(async (doc) => {
        const session = doc.data();
        if (session.exercisesCompleted.length === 0) {
            await deleteDoc(doc.ref);
        }
    });


    // Start a new session
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

// Delete a training session
const deleteTrainingSession = async (trainingSessionId) => {
    const sessionRef = doc(FIRESTORE_DB, 'trainingSessions', trainingSessionId);
    await deleteDoc(sessionRef);
    console.log("Training successfully deleted: ", trainingSessionId);
};


export {startTrainingSession, fetchTrainingSessions, completeExercise, deleteTrainingSession};