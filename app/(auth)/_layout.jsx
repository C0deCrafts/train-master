import {Slot, Stack} from "expo-router";

const RootStack = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="(tabs)"/>
            <Stack.Screen name="outside/index"/>
            <Stack.Screen name="outside/screen"/>
        </Stack>
    )
}

export default RootStack;