import {Stack} from "expo-router";
const StackTrainingLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="training"/>
            <Stack.Screen name="(exercises)"/>
            <Stack.Screen name="[workoutId]" />
        </Stack>
    )
}

export default StackTrainingLayout;