import {Stack} from "expo-router";
import friendGroups from "./friendGroups";

const StackLayout = () => {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="friendGroups"/>
            <Stack.Screen name="chat/[id]"/>
        </Stack>
    );
};

export default StackLayout;
