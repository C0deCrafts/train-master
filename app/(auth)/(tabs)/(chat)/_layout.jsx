import {Stack} from "expo-router";

const StackLayout = () => {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="chats"/>
            <Stack.Screen name="privateChatRoom"/>
            <Stack.Screen name="publicChatRoom"/>
        </Stack>
    );
};

export default StackLayout;
