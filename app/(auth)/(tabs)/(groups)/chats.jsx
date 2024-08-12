import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {Image} from "expo-image";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {elements, images} from "../../../../constants";
import Animated, {FadeInRight} from "react-native-reanimated";
import Card from "../../../../components/Card";
import elementStyles from "../../../../constants/elementStyles";
import {useAuth} from "../../../../context/AuthContext";
import ChatList from "../../../../components/ChatList";
import {usersRef} from "../../../../utils/firebase";
import {getDocs, query, where} from "firebase/firestore";

const Chats = () => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);
    const {user} = useAuth();

    const [users, setUsers] = useState([])

    const [selectedChatId, setSelectedChatId] = useState(0);

    const chats = [
        {id: 0, name: "Alle"},
        {id: 1, name: "Gruppen"},
        {id: 2, name: "Privat"},
        {id: 3, name: "Kontakte"}
    ]

    useEffect(() => {
        if(user.userId) {
            getUsers();
        }
    }, []);

    const getUsers = async () => {
        //fetch user
        const q = query(usersRef, where("userId", "!=", user?.userId));
        const querySnapshot = await getDocs(q);
        let data = [];

        querySnapshot.forEach(doc=>{
            data.push({...doc.data()});
        })

        console.log("Got users: ", data);
        setUsers(data);
    }

    return (
        <View style={styles.container}>
            <CustomHeader title={"Chats"}/>
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <View style={styles.content}>
                <View style={styles.chatsContainer}>
                    {chats.map((item, index) => (
                        <Animated.View key={item.id} entering={FadeInRight.delay(100).duration(index * 300)}>
                            <Card
                                style={item.id === selectedChatId ? styles.chatContainerSelected : styles.chatContainer}
                                onPress={() => setSelectedChatId(item.id)}
                                clickable
                            >
                                <Text
                                    style={item.id === selectedChatId ? styles.chatNameSelected : styles.chatName}>{item.name}</Text>
                            </Card>
                        </Animated.View>
                    ))}
                </View>
                    {selectedChatId === 3 && (
                        <>
                            {/*<Loading visible={users.length > 0} color={colors.white}/>*/}
                            <ChatList currentUser={user} users={users}/>
                        </>
                    )}
            </View>
        </View>
    );
};

export default Chats;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        content: {
            paddingHorizontal: elementStyles.spacingHorizontalDefault,
        },
        image: {
            position: "absolute",
            top: 50,
            width: "100%",
            height: "100%",
            contentFit: "contain",
            tintColor: colors.quaternaryLabel
        },
        chatsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        chatContainer: {
            //width: 110,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.secondary,
            borderRadius: elements.roundRadius,
            alignItems: "center",
            marginVertical: 10
        },
        chatContainerSelected: {
           // width: 110,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.baseColor,
            borderRadius: elements.roundRadius,
            alignItems: "center",
            marginVertical: 10
        },
        chatName: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: 5,
            color: colors.label
        },
        chatNameSelected: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: 5,
            color: colors.colorButtonLabel
        },
        exerciseListContainer: {
            flex: 1,
            marginTop: 5,
        },
    })
}