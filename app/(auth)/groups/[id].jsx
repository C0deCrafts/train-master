import {
    Button,
    FlatList, Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import { useLocalSearchParams } from "expo-router"
import {useEffect, useState, useLayoutEffect, useRef} from "react";
import CustomHeader from "../../../components/CustomHeader";
import {useAuth} from "../../../context/AuthProvider";
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";
import {FIRESTORE_DB} from "../../../config/firebaseConfig";
import {colors, images} from "../../../constants";
import {useAppStyle} from "../../../context/AppStyleContext";

const GroupPage = () => {
    const { id, name } = useLocalSearchParams();
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);
    const { getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);


    const sendMessages = async () => {
        if(message.trim().length > 0){
            const msg = message.trim();
            addDoc(collection(FIRESTORE_DB, `friendGroups/${id}/groups`),{
                text: msg,
                from: user.uid,
                createdAt: serverTimestamp()
            })
            setMessage("");
        }
    }
    useLayoutEffect(() => {
        const msgCollection = collection(FIRESTORE_DB, `friendGroups/${id}/groups`);
        const q = query(msgCollection, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            setMessages(messages);
        });
        return unsubscribe;
    }, []);

    const renderMessage = ({item}) => {
        const isMe = item.from === user.uid;
        return (
            <View style={[styles.messageContainer, isMe ? styles.userMessageContainer : styles.otherMessageContainer]}>
                <Text style={isMe ? styles.userMessageText : styles.messageText}>{item.text}</Text>
                <Text style={isMe ? styles.userTime : styles.time}>{item.createdAt?.toDate().toLocaleDateString()}</Text>
            </View>
        )
    }

    return (
        <>
            <CustomHeader title={name} backButtonVisible={true}/>
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <KeyboardAvoidingView behavior={
                Platform.OS === "ios" ? "padding" : "height"
            } style={styles.container}>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                <View style={styles.textInputContainer}>
                    <TextInput value={message}
                               onChangeText={setMessage}
                               multiline={true}
                               style={styles.textInput}
                               scrollEnabled={true}
                               maxHeight={120}
                    />
                    <Pressable onPress={sendMessages} style={styles.button}>
                        <Text style={styles.buttonLabel}>Senden</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </>
    );
};

export default GroupPage;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        //kein logo wenn hintergrund
        container: {
            flex: 1,
        },
        image: {
            position: "absolute",
            top: 50,
            width: "100%",
            height: "100%",
            resizeMode: "contain",
            tintColor: colors.quaternaryLabel,
        },
        textInputContainer: {
            flexDirection: "row",
            gap: 10,
            paddingBottom: 10,
            paddingHorizontal: 20,
        },
        textInput: {
            flex: 1,
            color: colors.label,
            backgroundColor: colors.secondary,
            borderRadius: 10,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: 14,
            padding: 10,
            zIndex: 2
        },
        messageContainer: {
            padding: 10,
            borderRadius: 10,
            marginHorizontal: 10,
            marginTop: 10,
            maxWidth: "80%"
        },
        userMessageContainer: {
            alignSelf: "flex-end",
            backgroundColor: colors.baseColor
        },
        otherMessageContainer: {
            alignSelf: "flex-start",
            backgroundColor: colors.secondary
        },
        userMessageText: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: 16,
            color: colors.colorButtonLabel
        },
        messageText: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: 16,
            color: colors.label
        },
        userTime: {
            alignSelf: "flex-end",
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: 10,
            color: colors.colorButtonLabel,
            marginTop: 5
        },
        time: {
            alignSelf: "flex-end",
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: 10,
            color: colors.label,
            marginTop: 5
        },
        button: {
            backgroundColor: colors.baseColor,
            borderRadius: 10,
            paddingHorizontal: 10,
            justifyContent: "center"
        },
        buttonLabel: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 14,
            color: colors.colorButtonLabel,
        }
    })
}