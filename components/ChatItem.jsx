import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import ChatAvatar from "./ChatAvatar";
import {formatDate, getRoomId} from "../utils/common";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query} from "firebase/firestore";
import {FIRESTORE_DB} from "../utils/firebase";
import Animated, {FadeInDown} from "react-native-reanimated";
import Card from "./Card";
import SwipeableRow from "./SwipeableRow";
import {appStyles} from "../constants/elementStyles";
import * as Haptics from "expo-haptics"

const ChatItem = ({item, router, currentUser, isGroup = false, index}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const [lastMessage, setLastMessage] = useState(undefined)
    const isMe = currentUser?.userId === lastMessage?.userId;

    useEffect(() => {
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(FIRESTORE_DB, "privateRooms", roomId);
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

    const openGroupChatRoom = () => {
        const encodedItem = {
            ...item,
            profileImage: encodeURIComponent(item.profileImage)
        };
        console.log("Pressed")
        router.push({pathname: '/publicChatRoom', params: encodedItem});
    }

    const renderLastMessage = (user) => {
        if (typeof lastMessage === "undefined") return "Loading...";
        if (lastMessage) {
            if (isMe) return "Du: " + lastMessage?.text;
            return lastMessage?.text;
        } else {
            return `Begrüße ${user} 👋`
        }
    }

    const renderTime = () => {
        if (typeof lastMessage === "undefined") return "Loading...";
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    }
    //console.log("last messages: ", lastMessage)

    const removeGroup = async (groupId, createdBy) => {
        if (currentUser?.userId !== createdBy) {
            Alert.alert("Aber Hallo 😧","Du bist nicht berechtigt, diese Gruppe zu löschen. Ist ja nicht deine");
            return;
        }

        try {
            await deleteDoc(doc(FIRESTORE_DB, "publicRooms", groupId));
            console.log("Gruppe erfolgreich gelöscht.");
        } catch (err) {
            console.log("Fehler beim Löschen der Gruppe:", err);
        }
    };

    const removeCall = async (groupItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        await removeGroup(groupItem.id, groupItem.createdBy)
    }

    return (
        <>
            {isGroup ? (
                        <Animated.View entering={FadeInDown.delay(200).duration(index * 300)}>
                                    <Card key={item.id}
                                          clickable
                                          onPress={openGroupChatRoom}
                                          style={styles.cardCustomStyle}
                                    >
                                        <SwipeableRow onDelete={() => removeCall(item)}>
                                            <View style={styles.cardCustomContentStyle}>
                                                <Text style={styles.groupName}>{item.name}</Text>
                                                <Text style={styles.groupDescription}>{item.description}</Text>
                                            </View>
                                        </SwipeableRow>
                                    </Card>
                        </Animated.View>
            ) : (
                       <Animated.View entering={FadeInDown.delay(200).duration(index * 300)}>
                           <Card key={item.id}
                                 clickable
                                 onPress={openChatRoom}
                                 style={styles.cardCustomStyle}
                           >
                               <SwipeableRow onDelete={()=> console.log("Remove Chat")}>
                                   <View style={styles.cardContainer}>
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
                                           <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode={"tail"}>{renderLastMessage(item?.username)}</Text>
                                       </View>
                                   </View>
                               </SwipeableRow>
                           </Card>
                       </Animated.View>
            )}
        </>
    );
};

export default ChatItem;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        cardContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center",
            padding: appStyles.cardPadding
        },
        border: {
            borderBottomWidth: 1,
            borderBottomColor: colors.quaternaryLabel,
        },
        avatarContainer: {
            marginRight: 10
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
            color: colors.label,
            width: 210
        },
        groupName: {
            fontSize: textStyles.headline,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label
        },
        groupDescription: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label
        },
        cardCustomStyle: {
            padding: 0
        },
        cardCustomContentStyle: {
            padding: appStyles.cardPadding
        }
    })
}