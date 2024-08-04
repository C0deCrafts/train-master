import {Stack} from "expo-router";
const StackSettingsLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="settings"/>
            <Stack.Screen name="trainingData"/>
            <Stack.Screen name="userData"/>
        </Stack>
    )
}

export default StackSettingsLayout;