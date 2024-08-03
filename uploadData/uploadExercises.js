const { FIRESTORE_DB } = require('../utils/firebaseConfig');
const { doc, setDoc } = require('firebase/firestore');
const exercises = require('./exercises.json');

function generateId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function uploadExercises() {
    for (const exercise of exercises) {
        const exerciseId = generateId(exercise.name);
        const docRef = doc(FIRESTORE_DB, 'exercises', exerciseId);
        await setDoc(docRef, { ...exercise, id: exerciseId });
    }
    console.log('Id uploaded and Firestore updated successfully');
}

uploadExercises().catch(console.error);
