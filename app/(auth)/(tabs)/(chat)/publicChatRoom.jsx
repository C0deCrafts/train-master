import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import {useLocalSearchParams} from "expo-router"
import React, {useState, useRef, useEffect} from "react";
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";
import {useAuth} from "../../../../context/AuthContext";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {FIRESTORE_DB} from "../../../../utils/firebase";
import CustomHeader from "../../../../components/CustomHeader";
import MessageList from "../../../../components/MessageList";
import SendMessages from "../../../../components/SendMessages";
import {Image} from "expo-image";
import {images} from "../../../../constants";

const PublicChatRoom = () => {
    const {getTextStyles, getColors} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();
    const styles = createStyles(textStyles, colors);

    const {user} = useAuth();
    const item = useLocalSearchParams(); // second user
    const [publicMessages, setPublicMessages] = useState([])
    const textRef = useRef("");
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null)

    //const [message, setMessage] = useState("");
    //const [messages, setMessages] = useState([]);
    //const flatListRef = useRef(null);

    /*useEffect(() => {
        console.log("ITEM pubic: ", item)
        console.log("ITEM pubic ID: ", item.id)
    }, [item]);*/

    useEffect(() => {
        const docRef = collection(FIRESTORE_DB, `publicRooms/${item?.id}/messages`);
        const q = query(docRef, orderBy('createdAt', 'asc'));

        let unsubscribe = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()};
            });
            setPublicMessages(allMessages);
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
    }, [publicMessages]);

    const updateScrollView = () => {
        setTimeout(()=> {
            scrollViewRef?.current?.scrollToEnd({animated: true})
        },100)
    }

    /*useEffect(() => {
        console.log("Messages: ",publicMessages)
    }, [publicMessages]);*/

    const sendMessages = async () => {
        let message = textRef.current.trim();
        if(!message) return;
        try{
            const collectionRef = collection(FIRESTORE_DB, `publicRooms/${item?.id}/messages`);
            textRef.current = "";
            if(inputRef) inputRef?.current?.clear();
            const newDoc = await addDoc(collectionRef, {
                userId: user?.userId,
                text: message,
                profileImage: user?.profileImage,
                senderName: user?.username,
                createdAt: serverTimestamp(),
            })
            //console.log("new message id: ", newDoc.id)
        } catch (err) {
            console.error("Error sending message: ",err);
        }
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={item?.name} backButtonVisible={true}/>
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                  style={styles.keyboardContainer}>
                <View style={styles.messageContainer}>
                    <MessageList messages={publicMessages} currentUser={user} scrollViewRef={scrollViewRef} />
                    <SendMessages handleSendMessage={sendMessages}
                                  onChangeText={value => textRef.current = value}
                                  ref={inputRef}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default PublicChatRoom;

const createStyles = (textStyles, colors) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        messageContainer: {
            flex: 1,
            justifyContent: "space-between"
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