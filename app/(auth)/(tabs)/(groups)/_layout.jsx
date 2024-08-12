import {Stack} from "expo-router";

const StackLayout = () => {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="chats"/>
            <Stack.Screen name="groups/friendGroups"/>
            <Stack.Screen name="chat/[id]"/>
            <Stack.Screen name="privateChatRoom"/>
        </Stack>
    );
};

export default StackLayout;
