import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Pressable, StyleSheet, Text, View} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {Image} from "expo-image";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {elements, icons, images} from "../../../../constants";
import Animated, {FadeInRight} from "react-native-reanimated";
import Card from "../../../../components/Card";
import elementStyles from "../../../../constants/elementStyles";
import {useAuth} from "../../../../context/AuthContext";
import ChatList from "../../../../components/ChatList";
import {FIRESTORE_DB, usersRef} from "../../../../utils/firebase";
import {addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where} from "firebase/firestore";

const Chats = () => {
    const {getTextStyles, getColors, fontFamily, bottomTabSpacing} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);
    const {width, height} = Dimensions.get('window');
    const {user} = useAuth();

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(0);

    // Dimensionen für das iPhone X und größer
    const isAtLeastIPhoneX = width >= 375 && height >= 812;

    const buttonStyle = isAtLeastIPhoneX ? styles.largeDeviceButton : styles.smallDeviceButton;

    const chats = [
        {id: 0, name: "Alle"},
        {id: 1, name: "Gruppen"},
        {id: 2, name: "Privat"},
        {id: 3, name: "Kontakte"}
    ]

    useEffect(() => {
        if(user.userId) {
            getUsers();
            getChatGroups();
        }
    }, []);

    const getUsers = async () => {
        const q = query(usersRef, where("userId", "!=", user?.userId));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc=>{
            data.push({...doc.data()});
        })
        //console.log("Got users: ", data);
        setUsers(data);
    }

    const getChatGroups = async () => {
        const groupsCollection = collection(FIRESTORE_DB, "publicRooms");
        const q = query(groupsCollection, orderBy('createdAt', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const groups = snapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()};
            });
            setGroups(groups);
        });
    }

    const handleCreateGroups = async (groupName) => {
        //setLoading(true);
        try {
            await addDoc(collection(FIRESTORE_DB, "publicRooms"), {
                name: groupName,
                description: `Diese Gruppe wurde von "${user?.email}" erstellt`,
                createdAt: serverTimestamp(),
            })
        } catch (err) {
            console.log(err)
        } finally {
            //setLoading(false)
        }
    }

    const handleAddGroup = () => {
        Alert.prompt(
            'Neue Gruppe erstellen',
            'Wie soll deine superduper Gruppe heißen?',
            [
                {
                    text: 'Abbrechen',
                    style: 'cancel',
                },
                {
                    text: 'Erstellen',
                    onPress: (groupName) => {
                        if (groupName) {
                            handleCreateGroups(groupName);
                        } else {
                            Alert.alert('Ups!', 'Du hast keinen Namen eingegeben. Versuch es nochmal!');
                        }
                    },
                },
            ],
            'plain-text'
        );
    };
    //console.log("Chatgroups: ", groups)

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
                  <View style={styles.chatListContainer}>
                      {selectedChatId === 1 && (
                          <>
                              {/*<Loading visible={users.length > 0} color={colors.white}/>*/}
                              <ChatList currentUser={user} users={users} isChatGroup={true} chatGroups={groups}/>
                              <Pressable style={[styles.fab, buttonStyle]} onPress={handleAddGroup}>
                                  <Image source={icons.add} style={styles.icon}/>
                              </Pressable>
                          </>
                      )}
                      {selectedChatId === 2 && (
                          <>
                              {/*<Loading visible={users.length > 0} color={colors.white}/>*/}
                              <ChatList currentUser={user} users={users}/>
                          </>
                      )}
                  </View>
            </View>
        </View>
    );
};

export default Chats;

const createStyles = (textStyles, colors, fontFamily, bottomTabSpacing) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            //backgroundColor: "red",
        },
        content: {
            flex: 1,
            paddingHorizontal: elementStyles.spacingHorizontalDefault,
            backgroundColor: "transparent",
        },
        chatListContainer: {
            flex: 1,
            marginBottom: bottomTabSpacing,
            paddingBottom: 25 // need to fix scroll view
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
            marginBottom: 20,
        },
        chatContainer: {
            //width: 110,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.secondary,
            borderRadius: elements.roundRadius,
            alignItems: "center",
            marginTop: 20
        },
        chatContainerSelected: {
           // width: 110,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.baseColor,
            borderRadius: elements.roundRadius,
            alignItems: "center",
            marginTop: 20
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
        fab: {
            position: "absolute",
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.baseColor,
            borderRadius: 30,
            elevation: 8
        },
        largeDeviceButton: {
            right: 10,
            bottom: 18,
        },
        smallDeviceButton: {
            right: 5,
            bottom: 40,
        },
        icon: {
            width: 25,
            height: 25,
            tintColor: colors.colorButtonLabel
        },
    })
}