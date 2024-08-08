import {collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, deleteDoc} from 'firebase/firestore';
import {FIRESTORE_DB} from './firebase';
import {getAuth} from 'firebase/auth';
import {format} from "date-fns";

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

const fetchDailyStats = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    //error unhandled promise
    if (!user) {
        throw new Error("No user is logged in");
    }

    const sessionsCollection = collection(FIRESTORE_DB, 'trainingSessions');
    const q = query(sessionsCollection, where('userId', '==', user.uid));
    const sessionsSnapshot = await getDocs(q);

    const sessions = sessionsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const dailyStats = {};

    sessions.forEach(session => {
        const date = format(new Date(session.date), 'yyyy-MM-dd');

        if (!dailyStats[date]) {
            dailyStats[date] = {
                exercisesCompleted: 0,
                workouts: 0,
                totalDuration: 0,
                totalCalories: 0,
            };
        }

        dailyStats[date].exercisesCompleted += session.exercisesCompleted.length;
        dailyStats[date].workouts += 1;
        dailyStats[date].totalDuration += session.totalDuration;
        dailyStats[date].totalCalories += session.totalCalories;
    });

    return dailyStats;
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

export {startTrainingSession, fetchDailyStats, completeExercise, deleteTrainingSession};