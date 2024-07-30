import {Stack} from "expo-router";
const StackHomeLayout = () => {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="home"/>
        </Stack>
    )
}

export default StackHomeLayout;