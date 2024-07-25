import {Stack} from "expo-router";
const StackHomeLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="home"/>
            <Stack.Screen name="[id]"/>
        </Stack>
    )
}

export default StackHomeLayout;