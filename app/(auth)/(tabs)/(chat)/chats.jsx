import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {Image} from "expo-image";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {icons, images} from "../../../../constants";
import Animated, {FadeInRight} from "react-native-reanimated";
import Card from "../../../../components/Card";
import elementStyles, {appStyles} from "../../../../constants/elementStyles";
import {useAuth} from "../../../../context/AuthContext";
import ChatList from "../../../../components/ChatList";
import {FIRESTORE_DB, usersRef} from "../../../../utils/firebase";
import {addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where} from "firebase/firestore";

const Chats = () => {
    const {getTextStyles, getColors, fontFamily, bottomTabSpacing} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);
    const {user} = useAuth();

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(0);

    const chats = [
        {id: 0, name: "Alle"},
        {id: 1, name: "Gruppenchats"},
        {id: 2, name: "Privatchats"},
        {id: 3, name: "Kontakte"},
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

    const renderChatSelector = ({item, index}) => {
        return (
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
        )
    }

    return (
        <>
            <CustomHeader title={"Chats"}/>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <View style={styles.container}>
                    <View style={styles.scrollContainer}>
                        <FlatList
                            data={chats}
                            renderItem={renderChatSelector}
                            keyExtractor={item => item.id}
                            horizontal={true} // Set horizontal to true for horizontal scrolling
                            showsHorizontalScrollIndicator={false}
                            //contentContainerStyle={{justifyContent: "space-between"}}
                        />
                    </View>
                    <View style={styles.chatListContainer}>
                        {selectedChatId === 0 && (
                            <>
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.description}><Text style={styles.titleDescription}>Hinweis: </Text>
                                        Aktuell ist das Feature das alle Chats anzeigt noch nicht freigeschaltet.
                                        Du wirst informiert, sobald diese Funktionen zur Verfügung stehen.
                                    </Text>
                                    <View style={{marginTop: 20}}>
                                        <Text style={styles.description}>Nutze gerne die Funktionen <Text style={styles.titleDescription}>Gruppenchats </Text> und
                                            <Text style={styles.titleDescription}> Privatchats</Text>
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
                        {selectedChatId === 1 && (
                            <>
                                {/*<Loading visible={users.length > 0} color={colors.white}/>*/}
                                <ChatList currentUser={user} users={users} isChatGroup={true} chatGroups={groups}/>
                                <Pressable style={styles.fab} onPress={handleAddGroup}>
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
                        {selectedChatId === 3 && (
                            <>
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.description}><Text style={styles.titleDescription}>Hinweis: </Text>
                                        Aktuell ist das Feature Kontakte noch nicht freigeschaltet.
                                        Du wirst informiert, sobald diese Funktionen zur Verfügung stehen.
                                    </Text>
                                    <View style={{marginTop: 20}}>
                                        <Text style={styles.description}>Nutze gerne die Funktionen <Text style={styles.titleDescription}>Gruppenchats </Text> und
                                            <Text style={styles.titleDescription}> Privatchats</Text>
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </>
    );
};

export default Chats;

const createStyles = (textStyles, colors, fontFamily, bottomTabSpacing) => {
    return StyleSheet.create({
        backgroundImage: {
            flex: 1,
            backgroundColor: colors.primary,
            paddingBottom: bottomTabSpacing,
        },
        container: {
            flex: 1,
            paddingHorizontal: 20,
        },
        scrollContainer: {
            //backgroundColor: "red",
            //alignItems: "center",
        },
        content: {
            flex: 1,
            paddingHorizontal: elementStyles.spacingHorizontalDefault,
            backgroundColor: "transparent",
        },
        chatListContainer: {
            flex: 1,
            marginTop: appStyles.extraSpacingSmall,
        },
        image: {
            position: "absolute",
            top: appStyles.backgroundImagePositionTopWithHeader,
            width: "100%",
            height: "100%",
            tintColor: colors.quaternaryLabel,
            pointerEvents: "none"
        },
        chatContainer: {
            //width: 150,
            borderRadius: appStyles.cardRadiusLarge,
            marginRight: appStyles.spacingHorizontalSmall,
            marginTop: appStyles.spacingFromHeader,
            paddingHorizontal: 15
        },
        chatContainerSelected: {
            //width: 150,
            backgroundColor: colors.baseColor,
            borderRadius: appStyles.cardRadiusLarge,
            marginRight: appStyles.spacingHorizontalSmall,
            marginTop: appStyles.spacingFromHeader,
            paddingHorizontal: 15
        },
        chatName: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: 5,
            color: colors.label,
            textAlign: "center"
        },
        chatNameSelected: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            marginVertical: 5,
            color: colors.colorButtonLabel,
            textAlign: "center"
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
            elevation: 8,
            right: 10,
            bottom: 18,
        },
        icon: {
            width: 25,
            height: 25,
            tintColor: colors.colorButtonLabel
        },
        descriptionContainer: {
            marginBottom: appStyles.cardTitleSpacingBottom
        },
        description: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_Regular,
            color: colors.label,
        },
        titleDescription: {
            fontSize: textStyles.subhead,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.baseColor,
        },
    })
}