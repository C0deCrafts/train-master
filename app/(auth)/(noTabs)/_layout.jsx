import {Stack} from "expo-router";
const StackTrainingLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="[workoutId]" />
            <Stack.Screen name="exercise/[exerciseId]" />
            <Stack.Screen name="start/exercises" />
            <Stack.Screen name="start/rest" />
            <Stack.Screen name="start/prevExercise" />
        </Stack>
    )
}

export default StackTrainingLayout;