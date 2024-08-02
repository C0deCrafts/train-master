import { onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react";
import {FIREBASE_AUTH, FIRESTORE_DB} from "../config/firebaseConfig";
import {doc, getDoc, updateDoc} from "firebase/firestore";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
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
            const userDocument = await getDoc(doc(FIRESTORE_DB, "users", userId));
            if (userDocument.exists()) {
                setUsername(userDocument.data().username);
                setEmail(userDocument.data().email);
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

    return <AuthContext.Provider value={{ user, initialized, username, setUsername, email, handleUpdateUsername }}>
        {children}
    </AuthContext.Provider>;
}