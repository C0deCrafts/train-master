import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import ChatAvatar from "./ChatAvatar";
import {getRoomId} from "../utils/common";
import {collection, doc, onSnapshot, orderBy, query} from "firebase/firestore";
import {FIRESTORE_DB} from "../utils/firebase";
import {format, fromUnixTime} from 'date-fns';

const ChatItem = ({item, noBorder, router, currentUser}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [lastMessage, setLastMessage] = useState(undefined)
    const isMe = currentUser?.userId === lastMessage?.userId;

    useEffect(() => {
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(FIRESTORE_DB,"privateRooms", roomId);
        const messageRef = collection(docRef, "messages");

        const q = query(messageRef, orderBy("createdAt", "desc"));

        return onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map((doc) => {
                return doc.data();
            });
            setLastMessage(allMessages[0] ? allMessages[0] : null);
        });
    }, []);

    const openChatRoom = () => {
        const encodedItem = {
            ...item,
            profileImage: encodeURIComponent(item.profileImage)
        };
        console.log("Pressed")
        router.push({pathname: '/privateChatRoom', params: encodedItem});
    }

    const renderLastMessage = (user) => {
        if(typeof lastMessage === "undefined") return "Loading...";
        if(lastMessage){
            if(isMe) return "You: " + lastMessage?.text;
            return lastMessage?.text;
        } else {
            return `Begrüße ${user} 👋`
        }

    }

    const renderTime = () => {
        if(lastMessage) {
            let date = lastMessage?.createdAt;
            // Konvertiere den Zeitstempel in ein Date-Objekt
            const dateObject = fromUnixTime(date.seconds);
            // Formatiere das Datum
            return format(dateObject, 'dd. MMM');
        }
    }
    //console.log("last messages: ", lastMessage)

    return (
        <TouchableOpacity style={noBorder ? styles.container : [styles.container, styles.border]} onPress={openChatRoom}>
            <View style={styles.avatarContainer}>
                <ChatAvatar imageRadius={50}
                            imageUrl={item.profileImage}
                />
            </View>

            {/*name and last message*/}
            <View style={styles.chatContainer}>
                <View style={styles.chatContent}>
                    <Text style={styles.name}>{item?.username}</Text>
                    <Text style={styles.time}>{renderTime()}</Text>
                </View>
                <Text style={styles.lastMessage}>{renderLastMessage(item?.username)}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatItem;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
        },
        border: {
            borderBottomWidth: 1,
            borderBottomColor: colors.quaternaryLabel,
        },
        avatarContainer: {
            marginVertical: 10,
        },
        chatContainer: {
            flex: 1,
        },
        chatContent: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        name: {
            fontFamily: fontFamily.Poppins_SemiBold,
            fontSize: textStyles.body,
            color: colors.label
        },
        time: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.footnote,
            color: colors.label
        },
        lastMessage: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.footnote,
            color: colors.label
        }
    })
}