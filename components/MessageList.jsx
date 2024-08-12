import {StyleSheet, ScrollView} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import MessageItem from "./MessageItem";
import {useEffect} from "react";

const MessageList = ({messages, currentUser, scrollViewRef}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    useEffect(() => {
        console.log("MESSAGES: LIST: ", messages)
    }, [messages]);

    return (
        <ScrollView style={styles.container}
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    //contentContainerStyle={{paddingTop: 10}}
        >
            {messages.map((message, index) => (
                <MessageItem message={message} key={index} currentUser={currentUser}/>
            ))}
        </ScrollView>
    );
};

export default MessageList;

const createStyles = (textStyles, colors) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "transparent",
        },
        text: {
            color: colors.label
        }
    })
}