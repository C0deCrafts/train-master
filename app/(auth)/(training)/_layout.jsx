import {Stack} from "expo-router";
const StackTrainingLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="training"/>
            <Stack.Screen name="[id]"/>
        </Stack>
    )
}

export default StackTrainingLayout;