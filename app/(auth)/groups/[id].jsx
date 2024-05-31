import {
    Button,
    FlatList,
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
import {colors} from "../../../constants";

const GroupPage = () => {
    const { id, name } = useLocalSearchParams();
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

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
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.time}>{item.createdAt?.toDate().toLocaleDateString()}</Text>
            </View>
        )
    }

    return (
        <>
            <CustomHeader title={name} backButtonVisible={true}/>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputContainer: {
        flexDirection: "row",
        gap: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    textInput: {
        flex: 1,
        color: colors.textColorDark,
        backgroundColor: colors.boxColor,
        borderRadius: 10,
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        padding: 10,
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
        backgroundColor: colors.chatColor
    },
    otherMessageContainer: {
        alignSelf: "flex-start",
        backgroundColor: colors.boxColor
    },
    messageText: {
        fontFamily: "Poppins-Regular",
        fontSize: 16
    },
    time: {
        alignSelf: "flex-end",
        fontFamily: "Poppins-Light",
        fontSize: 10,
        color: colors.backgroundColorBlueGreen,
        marginTop: 5
    },
    button: {
        backgroundColor: colors.backgroundColorBlueGreen,
        borderRadius: 10,
        paddingHorizontal: 10,
        justifyContent: "center"
    },
    buttonLabel: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 14,
        color: colors.white,
    }
})