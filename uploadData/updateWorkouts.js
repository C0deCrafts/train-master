const { FIRESTORE_DB } = require('../utils/firebase');
const { doc, setDoc } = require('firebase/firestore');
const workouts = require('./workoutsWithExercises.json');

async function updateWorkouts() {
    for (const workout of workouts) {
        const docRef = doc(FIRESTORE_DB, 'workouts', workout.id);
        await setDoc(docRef, workout, { merge: true });
    }
    console.log('Workouts updated with exercises successfully');
}

updateWorkouts().catch(console.error);
