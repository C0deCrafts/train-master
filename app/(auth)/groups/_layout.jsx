import {Stack} from "expo-router";

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="friendGroups" options={{
                headerShown: false
            }}/>
            <Stack.Screen name="[id]"/>
        </Stack>
    );
};

export default StackLayout;
