import {StyleSheet, View, Text} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import {Image} from "expo-image";
import {DEFAULT_PROFILE_IMAGE_URL} from "../utils/firebase";
//fix username to sendername

const MessageItem = ({message, currentUser}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const isMe = currentUser?.userId === message?.userId;

    return (
        <View style={[styles.messageWrapper, isMe ? styles.userMessageWrapper : styles.otherMessageWrapper]}>
            {!isMe && (
                <Image
                    source={message?.profileImage ? { uri: message?.profileImage } : DEFAULT_PROFILE_IMAGE_URL}
                    style={styles.avatar}
                />
            )}
            <View style={[styles.messageContainer, isMe ? styles.userMessageContainer : styles.otherMessageContainer]}>
                {!isMe && <Text style={styles.username}>{message.senderName}</Text>}
                <Text style={isMe ? styles.userMessageText : styles.messageText}>{message.text}</Text>
                <Text style={isMe ? styles.userTime : styles.time}>{message.createdAt?.toDate().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</Text>
            </View>
        </View>
    );
};

export default MessageItem;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        text: {
            color: "red"
        },
        messageWrapper: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginHorizontal: 10,
            marginTop: 10,
        },
        userMessageWrapper: {
            justifyContent: 'flex-end',
        },
        otherMessageWrapper: {
            justifyContent: 'flex-start',
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        messageContainer: {
            padding: 10,
            borderRadius: 10,
            maxWidth: "80%",
        },
        userMessageContainer: {
            backgroundColor: colors.baseColor,
            alignSelf: 'flex-end',
        },
        otherMessageContainer: {
            backgroundColor: colors.secondary,
            alignSelf: 'flex-start',
        },
        userTime: {
            alignSelf: "flex-end",
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.caption_2,
            color: colors.colorButtonLabel,
            marginTop: 5,
        },
        time: {
            alignSelf: "flex-end",
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.caption_2,
            color: colors.label,
            marginTop: 5,
        },
        username: {
            fontSize: textStyles.footnote,
            color: colors.baseColor,
            fontFamily: fontFamily.Poppins_SemiBold,
        },
        userMessageText: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.callout,
            color: colors.colorButtonLabel,
        },
        messageText: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.callout,
            color: colors.label,
        },
    })
}