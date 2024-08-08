import { onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react";
import {DEFAULT_PROFILE_IMAGE_URL, FIREBASE_AUTH, FIRESTORE_DB, uploadProfileImage} from "../utils/firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user)=> {
            //console.log("onAuthStateChanged", user);
            //console.log("USER:", user)
            setUser(user);
            //console.log("USER:", user)
            setInitialized(true)

            if (user) {
                await loadUserInfo(user.uid);
            }
            return () => unsubscribe();
        })
    }, []);

    const loadUserInfo = async (userId) => {
        try {
            // Zuerst das Profilbild aus dem AsyncStorage laden
            const localProfileImage = await AsyncStorage.getItem('profileImageUrl');
            if (localProfileImage) {
                setProfileImage(localProfileImage);
            }

            const userDocument = await getDoc(doc(FIRESTORE_DB, "users", userId));
            if (userDocument.exists()) {
                setUsername(userDocument.data().username);
                setEmail(userDocument.data().email);
                const imageUrl = userDocument.data().profileImageUrl || DEFAULT_PROFILE_IMAGE_URL;
                setProfileImage(imageUrl);
                // Profilbild in AsyncStorage speichern
                await AsyncStorage.setItem('profileImageUrl', imageUrl);
            }
        } catch (error) {
            console.error("Error loading user information: ", error);
        }
    };

    const handleUpdateUsername = async (newUsername) => {
        try {
            await updateDoc(doc(FIRESTORE_DB, 'users', user.uid), {
                username: newUsername
            });
            setUsername(newUsername); // Aktualisiere den Zustand mit dem neuen Benutzernamen
            console.log("Username geändert: ", newUsername);
        } catch (err) {
            console.error("Error beim ändern des Usernamens: ",err);
        }
    };

    const handleUpdateProfileImage = async (newProfileImageUri, userId) => {
        try {
            setProfileImage(newProfileImageUri);  // Update UI immediately
            // Upload in the background
            const imageUrl = await uploadProfileImage(newProfileImageUri, userId);
            await updateDoc(doc(FIRESTORE_DB, 'users', userId), {
                profileImageUrl: imageUrl
            });
            await AsyncStorage.setItem('profileImageUrl', imageUrl);
        } catch (err) {
            console.error("Error beim Ändern des Profilbildes: ", err);
        }
    };

    return <AuthContext.Provider value={{ user, initialized, username, setUsername, email, profileImage, handleUpdateUsername, handleUpdateProfileImage }}>
        {children}
    </AuthContext.Provider>;
}