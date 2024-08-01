import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import { Image } from 'expo-image';
import {useEffect, useState} from "react";
import { addDoc, collection, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import {FIRESTORE_DB} from "../../../../config/firebaseConfig";
import {icons, images} from "../../../../constants";
import Spinner from "react-native-loading-spinner-overlay";
import {useAuth} from "../../../../context/AuthProvider";
import {Link} from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import {useAppStyle} from "../../../../context/AppStyleContext";
import Card from "../../../../components/Card";
import elementStyles from "../../../../constants/elementStyles";

const FriendGroups = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const { getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme } = useAppStyle();

    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);


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
            <Image
                source={images.backgroundSymbol}
                style={styles.image}
            />
            <Spinner visible={loading}/>
            <FlatList data={groups}
                      keyExtractor={(item)=> item.id}
                      numColumns={1}
                      contentContainerStyle={styles.scrollContainer}
                      renderItem={({item})=> (
                          <Card key={item.id}
                                clickable
                                href={{pathname: "/chat/[id]", params: {id: item.id, name: item.name}}}>
                              <Text style={styles.groupName}>{item.name}</Text>
                              <Text style={styles.groupDescription}>{item.description}</Text>
                          </Card>
                      )}
            />
            <Pressable style={styles.fab} onPress={handleAddGroup}>
                <Image source={icons.add} style={styles.icon}/>
            </Pressable>
        </View>
    );
};

export default FriendGroups;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
        },
        image: {
            position: "absolute",
            top: 50,
            width: "100%",
            height: "100%",
            resizeMode: "contain",
            tintColor: colors.quaternaryLabel
        },
        scrollContainer: {
            marginTop: 20,
            paddingHorizontal: elementStyles.spacingHorizontalDefault,
            gap: elementStyles.spacingVerticalSmall
        },
        fab: {
            position: "absolute",
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            right: 20,
            bottom: 20,
            backgroundColor: colors.baseColor,
            borderRadius: 30,
            elevation: 8
        },
        icon: {
            width: 25,
            height: 24,
            tintColor: colors.colorButtonLabel
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
        }
    })
}