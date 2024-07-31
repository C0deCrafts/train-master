import {Stack} from "expo-router";
const StackTrainingLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="training"/>
            <Stack.Screen name="[workoutId]" />
            <Stack.Screen name="exercise/[exerciseId]" />
        </Stack>
    )
}

export default StackTrainingLayout;