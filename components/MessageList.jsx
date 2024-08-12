import {StyleSheet, ScrollView} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import MessageItem from "./MessageItem";

const MessageList = ({messages, currentUser, scrollViewRef}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

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
            backgroundColor: colors.primary,
        },
        text: {
            color: colors.label
        }
    })
}