import { Stack } from "expo-router";

const StackTrainingDetailLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="exercises" />
            <Stack.Screen name="[exerciseId]" />
        </Stack>
    );
}

export default StackTrainingDetailLayout;
