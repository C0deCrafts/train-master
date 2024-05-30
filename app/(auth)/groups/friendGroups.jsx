import {Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {useEffect, useState} from "react";
import { addDoc, collection, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import {FIRESTORE_DB} from "../../../config/firebaseConfig";
import {colors, icons} from "../../../constants";
import Spinner from "react-native-loading-spinner-overlay";
import {useAuth} from "../../../context/AuthProvider";
import {Link} from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

const FriendGroups = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const groupsCollection = collection(FIRESTORE_DB, "friendGroups");
        const q = query(groupsCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const groups = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            setGroups(groups);
        });
        return unsubscribe;
    }, []);


    const handleCreateGroups = async (groupName) => {
        setLoading(true);
        try {
            const doc = await addDoc(collection(FIRESTORE_DB, "friendGroups"), {
                name: groupName,
                description: `Diese Gruppe wurde von "${user.email}" erstellt`,
                createdAt: serverTimestamp(),
            })
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
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

    return (
        <View style={styles.container}>
            <CustomHeader title={"Gruppen"}/>
            <Spinner visible={loading}/>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {groups.map((group)=> {
                    return (
                        <Link href={{pathname: `/groups/${group.id}`, params: {name: group.name}}}
                              key={group.id }
                              asChild>
                            <TouchableOpacity style={styles.groupCard}>
                                <Text style={styles.groupName}>{group.name}</Text>
                                <Text style={styles.groupDescription}>{group.description}</Text>
                            </TouchableOpacity>
                        </Link>

                    );
                })}
            </ScrollView>
            <Pressable style={styles.fab} onPress={handleAddGroup}>
                <Image source={icons.add} style={styles.icon}/>
            </Pressable>
        </View>
    );
};

export default FriendGroups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: colors.backgroundColorBlueGreen,
        height: 120
    },
    scrollContainer: {
        marginTop: 20
    },
    fab: {
        position: "absolute",
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        right: 20,
        bottom: 20,
        backgroundColor: colors.buttonBackgroundDefault,
        borderRadius: 30,
        elevation: 8
    },
    icon: {
        width: 25,
        height: 24,
        tintColor: colors.white
    },
    groupCard: {
        padding: 10,
        marginBottom: 5,
        backgroundColor: colors.boxColor,
        borderRadius: 5,
        elevation: 2
    },
    groupName: {
        fontSize: 18,
        fontFamily: "Poppins-SemiBold"
    },
    groupDescription: {
        fontSize: 14,
        fontFamily: "Poppins-Light"
    }
})