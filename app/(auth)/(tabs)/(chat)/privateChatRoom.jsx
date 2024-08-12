import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {useLocalSearchParams} from "expo-router";
import SendMessages from "../../../../components/SendMessages";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {useAuth} from "../../../../context/AuthContext";
import {getRoomId} from "../../../../utils/common";
import {addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";
import {FIRESTORE_DB} from "../../../../utils/firebase";
import MessageList from "../../../../components/MessageList";
import {Image} from "expo-image";
import {images} from "../../../../constants";

const PrivateChatRoom = () => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors, fontFamily);

    const {user} = useAuth() // logged in user
    const item = useLocalSearchParams(); // second user
    const [privateMessages, setPrivateMessages] = useState([])
    const textRef = useRef("");
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null)

    useEffect(() => {
        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(FIRESTORE_DB,"privateRooms", roomId);
        const messageRef = collection(docRef, "messages");

        const q = query(messageRef, orderBy("createdAt", "asc"));

        let unsubscribe = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map((doc) => {
                return doc.data();
            });
            setPrivateMessages([...allMessages]);
        });

        const KeyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow", updateScrollView
        )

        return () => {
            unsubscribe();
            KeyboardDidShowListener.remove();
        }
    }, []);

    useEffect(() => {
        updateScrollView();
    }, [privateMessages]);

    const updateScrollView = () => {
        setTimeout(()=> {
            scrollViewRef?.current?.scrollToEnd({animated: true})
        },100)
    }

    // Nutze decodedItem im Component
    console.log("Item privateChatRoom: ", item)
    console.log("URL privateChatRoom: ", item.profileImage)

    const sendMessages = async () => {
        console.log("Sending messages");
        let message = textRef.current.trim();
        if(!message) return;
        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(FIRESTORE_DB, "privateRooms", roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if(inputRef) inputRef?.current?.clear();

            //maybe some more data like user has read the message
            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text: message,
                //profileImage: user?.profileImage,
                //senderName: user?.username,
                createdAt: serverTimestamp(),
            });
            //console.log("new message id: ", newDoc.id)
        } catch (err) {
            console.error("Error sending message: ",err);
        }
    }
    //console.log("Messages: ", privateMessages)

    return (
        <View style={styles.container}>
            <CustomHeader title={item?.username}
                          backButtonVisible={true}
                          chatAvatarVisible={true}
                          imageUrl={item.profileImage}
            />
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                  style={styles.keyboardContainer}>
                <View style={styles.messageContainer}>
                    <MessageList messages={privateMessages} currentUser={user} scrollViewRef={scrollViewRef} />
                    <SendMessages handleSendMessage={sendMessages}
                                  onChangeText={value => textRef.current = value}
                                  ref={inputRef}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default PrivateChatRoom;

const createStyles = (textStyles, colors) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        messageContainer: {
            flex: 1,
            justifyContent: "space-between",
        },
        messages: {
            flex: 1,
            backgroundColor: colors.primary
        },
        keyboardContainer: {
            flex: 1
        },
        image: {
            position: "absolute",
            top: 50,
            width: "100%",
            height: "100%",
            contentFit: "contain",
            tintColor: colors.quaternaryLabel,
            pointerEvents: "none" // verhindert, dass das Bild Touch-Events empfängt
        },
    })
}