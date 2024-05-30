import {Stack} from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

const StackLayout = () => {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="friendGroups"/>
            <Stack.Screen name="[id]"/>
        </Stack>
    );
};

export default StackLayout;
