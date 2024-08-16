import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import {Image} from "expo-image";
import {useAppStyle} from "../../../../context/AppStyleContext";
import {icons, images} from "../../../../constants";
import Animated, {FadeInRight, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Card from "../../../../components/Card";
import elementStyles, {appStyles} from "../../../../constants/elementStyles";
import {useAuth} from "../../../../context/AuthContext";
import ChatList from "../../../../components/ChatList";
import {FIRESTORE_DB, usersRef} from "../../../../utils/firebase";
import {addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where} from "firebase/firestore";
import ChatItem from "../../../../components/ChatItem";
import {useRouter} from "expo-router";

const Chats = () => {
    const {getTextStyles, getColors, fontFamily, bottomTabSpacing} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily, bottomTabSpacing);
    const {user} = useAuth();

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(0);

    const scrollY = useSharedValue(0);

    const router = useRouter();

    const screenHeight = Dimensions.get('window').height;

    const shouldBounce = groups.length + users.length > 8; // MIN_ITEMS_TO_SCROLL ist eine von dir definierte Schwelle


    const chats = [
        {id: 0, name: "Alle"},
        {id: 1, name: "Gruppenchats"},
        {id: 2, name: "Privatchats"},
        {id: 3, name: "Kontakte"},
    ];

    useEffect(() => {
        if (user.userId) {
            getUsers();
            getChatGroups();
        }
    }, []);

    const getUsers = async () => {
        const q = query(usersRef, where("userId", "!=", user?.userId));
        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc => {
            data.push({...doc.data()});
        });
        setUsers(data);
    };

    const getChatGroups = async () => {
        const groupsCollection = collection(FIRESTORE_DB, "publicRooms");
        const q = query(groupsCollection, orderBy('name', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const groups = snapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()};
            });
            setGroups(groups);
        });
    };

    const handleCreateGroups = async (groupName) => {
        try {
            await addDoc(collection(FIRESTORE_DB, "publicRooms"), {
                name: groupName.charAt(0).toUpperCase() + groupName.slice(1),
                description: `Diese Gruppe wurde von "${user?.email}" erstellt`,
                createdAt: serverTimestamp(),
                createdBy: user?.userId,
            });
        } catch (err) {
            console.log(err);
        }
    };

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
        );
    };


    const handleScroll = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;

        // Limit the "bounces" effect to a small range
        if (yOffset < -30) {
            scrollY.value = -30;
        } else if (yOffset > (event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height + 30)) {
            scrollY.value = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height + 30;
        } else {
            scrollY.value = yOffset;
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        const translateY = scrollY.value > 200 ? -100 : 0;
        const opacity = scrollY.value > 300 ? 0 : 1;

        return {
            transform: [
                {
                    translateY: withTiming(translateY, {duration: 500}),
                },
            ],
            opacity: withTiming(opacity, {duration: 500}),
            backgroundColor: colors.primary, // Hintergrund des Containers synchronisieren
            position: scrollY.value > 50 ? 'absolute' : 'relative', // Wird fixiert, wenn über 50 gescrollt
            top: scrollY.value > 50 ? 0 : undefined,
            //zIndex: scrollY.value > 50 ? 9998 : 1, // Stellt sicher, dass der ScrollContainer über der ChatList bleibt
            zIndex: 2
        };
    });

    const searchFieldStyle = useAnimatedStyle(() => {
        const translateY = scrollY.value > 12.5 ? -6.25 : 0;  // Bewegt die Suchleiste nach oben, wenn scrollY > 100
        const opacity = scrollY.value > 25 ? 0 : 1; // Reduziert die Opazität früher als der Haupt-Container


        return {
            transform: [{ translateY: withTiming(translateY, { duration: 500 }) }],
            opacity: withTiming(opacity, { duration: 500 }),
            backgroundColor: colors.primary, // Hintergrund des Containers synchronisieren
            position: scrollY.value > 50 ? 'absolute' : 'relative', // hier gibt es leider wieder ein problem, wenn es nicht soviele chats gibt
            //zIndex: scrollY.value > 50 ? 9997 : 1, // Stellt sicher, dass der ScrollContainer über der ChatList bleibt
            zIndex: 1
        };
    });



    return (
        <>
            <View style={{zIndex: 9999}}>
                <CustomHeader title={"Chats"}/>
            </View>
            <View style={styles.backgroundImage}>
                <Image
                    source={images.backgroundSymbol}
                    style={styles.image}
                />
                <Animated.View style={[styles.scrollContainer, animatedStyle]}>
                    <FlatList
                        data={chats}
                        renderItem={renderChatSelector}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </Animated.View>
                <Animated.View style={[styles.searchFieldContainer, searchFieldStyle ]}>
                    <TextInput
                        style={styles.searchField}
                        placeholder="Suchen..."
                        placeholderTextColor={colors.placeholderText}
                    />
                    <View style={styles.iconContainer}>
                        <Image source={icons.search} style={styles.iconSearch}/>
                    </View>
                </Animated.View>
                <View style={{flex: 1}}>
                    {selectedChatId === 1 &&(
                        <Pressable style={styles.fab} onPress={handleAddGroup}>
                            <Image source={icons.add} style={styles.icon}/>
                        </Pressable>
                    )}
                    <ScrollView onScroll={handleScroll}
                                scrollEventThrottle={16}
                                showsVerticalScrollIndicator={false}
                                bounces={true}
                    >
                        <View style={styles.container}>
                            <View style={styles.chatListContainer}>
                                {selectedChatId === 0 && (
                                    <View>
                                        <View style={styles.spacing}>
                                            <Text style={styles.title}>Gruppenchats</Text>
                                        </View>
                                        {groups.map((item, index) => (
                                            <ChatItem item={item}
                                                      index={index}
                                                      isGroup={true}
                                                      router={router}
                                                      key={index}
                                                      currentUser={user}
                                            />
                                        ))}
                                        <View style={styles.spacing}>
                                            <Text style={styles.title}>Privaten Chats</Text>
                                        </View>
                                        {users.map((user, index) => (
                                            <ChatItem
                                                noBorder={index + 1 === users.length}
                                                router={router}
                                                item={user}
                                                key={index}
                                                currentUser={user}
                                            />
                                        ))}
                                    </View>
                                )}
                                {selectedChatId === 1 && (
                                    <>
                                        {groups.map((item, index) => (
                                            <ChatItem item={item}
                                                      index={index}
                                                      isGroup={true}
                                                      router={router}
                                                      key={index}
                                                      currentUser={user}
                                            />
                                        ))}
                                    </>
                                )}
                                {selectedChatId === 2 && (
                                    <>
                                        {users.map((user, index) => (
                                            <ChatItem
                                                noBorder={index + 1 === users.length}
                                                router={router}
                                                item={user}
                                                key={index}
                                                currentUser={user}
                                            />
                                        ))}
                                    </>
                                )}
                                {selectedChatId === 3 && (
                                    <>
                                        <View style={styles.descriptionContainer}>
                                            <Text style={styles.description}><Text
                                                style={styles.titleDescription}>Hinweis: </Text>
                                                Aktuell ist das Feature das Kontakte anzeigt werden noch nicht
                                                freigeschaltet.
                                                Du wirst informiert, sobald diese Funktionen zur Verfügung stehen.
                                            </Text>
                                            <View style={{marginTop: 20}}>
                                                <Text style={styles.description}>Nutze gerne die Funktionen <Text
                                                    style={styles.titleDescription}>Gruppenchats </Text> und
                                                    <Text style={styles.titleDescription}> Privatchats</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </ScrollView>
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
            zIndex: 1,
            backgroundColor: colors.primary, // Hintergrundfarbe synchronisieren
            paddingHorizontal: 20,
        },
        chatListContainer: {
            flex: 1,
            marginTop: appStyles.extraSpacingSmall,
            //backgroundColor: "green"
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
            borderRadius: appStyles.cardRadiusLarge,
            marginRight: appStyles.spacingHorizontalSmall,
            marginTop: appStyles.spacingFromHeader,
            paddingHorizontal: 15
        },
        chatContainerSelected: {
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
        title: {
            fontSize: textStyles.title_3,
            fontFamily: fontFamily.Poppins_SemiBold,
            color: colors.label,
            marginVertical: 5,
        },
        spacing: {
            marginBottom: appStyles.cardTitleSpacingBottom - 5
        },
        searchFieldContainer: {
            overflow: 'hidden', // Verhindert, dass das Suchfeld über den Rand hinausgeht
            flexDirection: "row",
            gap: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: colors.primary,
            zIndex: 1,
            alignItems: "flex-end",
        },
        searchField: {
            flex: 1,
            color: colors.label,
            backgroundColor: colors.secondary,
            borderRadius: 10,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            padding: 10,
        },
        iconContainer: {
            //flex: 1,
            //backgroundColor: colors.secondary,
            alignSelf: "center",
        },
        iconSearch: {
            width: 30,
            height: 30,
            tintColor: colors.baseColor,
        }
    });
};
