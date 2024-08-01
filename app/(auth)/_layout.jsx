import {Slot, Stack} from "expo-router";

const RootStack = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="(tabs)"/>
            <Stack.Screen name="(noTabs)"/>
        </Stack>
    )
}

export default RootStack;