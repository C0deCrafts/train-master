import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {createContext, useContext, useEffect, useState} from "react";
import {DEFAULT_PROFILE_IMAGE_URL, FIREBASE_AUTH, FIRESTORE_DB, uploadProfileImage} from "../utils/firebase";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";

export const AuthContext = createContext({});

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState( {})
    const [profileImage, setProfileImage] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAppReady, setIsAppReady] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
                if (user) {
                    setIsAuthenticated(true)
                    setUser(user);
                    await updateUserData(user.uid)
                } else {
                    setIsAuthenticated(false)
                    setUser(null);
                }
            setIsAppReady(true)
        });
        return () => unsubscribe();
    }, []);

    //save userdata
    const updateUserData = async (userId) => {
        try {
            // Zuerst das Profilbild aus dem AsyncStorage laden
            /*const localProfileImage = await AsyncStorage.getItem('profileImage');
            if (localProfileImage) {
                setProfileImage(localProfileImage);
            }*/
            const docRef = doc(FIRESTORE_DB, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let data = docSnap.data();
                console.log("DATA: ",data)

                setUser({...user,
                    username: data.username,
                    email: data.email,
                    profileImage: data.profileImage || DEFAULT_PROFILE_IMAGE_URL,
                    userId: data.userId,
                })
                setProfileImage(data.profileImage || DEFAULT_PROFILE_IMAGE_URL);
                // Profilbild in AsyncStorage speichern
                //await AsyncStorage.setItem('profileImage', data.profileImage);
            }
        } catch (error) {
            console.error("Error loading user information: ", error);
        }
    };

    //login
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            return {success: true};
        } catch (err) {
            let message;
            switch (err.code) {
                case "auth/invalid-credential":
                    message = ["Hoppla!", "Bist du schon registriert? Wenn ja, dann scheint dein Passwort falsch zu sein. Versuch's nochmal!"];
                    break;
                case "auth/invalid-email":
                    message = ["Hoppla!", "Deine Email ist ungültig. Versuch's nochmal!"];
                    break;
                case "auth/missing-email":
                    message = ["Hoppla!", "Deine Email ist ungültig. Versuch's nochmal!"];
                    break;
                default:
                    message = ["Uups!", `Irgendwas lief schief: ${err.message}. Keine Panik, wir kriegen das hin!`];
            }
            return {success: false, message};
        }
    }

    //logout
    const logout = async () => {
        try {
            console.log("Logging out");
            await signOut(FIREBASE_AUTH);
            return {success: true}
        } catch (err) {
            return {success: false, message: err.message, error: err}
        }
    }

    //register
    const register = async (email, password, username) => {
        try {
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log("response.user: ", response?.user)

            await setDoc(doc(FIRESTORE_DB, "users", response?.user?.uid), {
                email,
                username,
                profileImage: DEFAULT_PROFILE_IMAGE_URL,
                userId: response?.user?.uid,
            })
            return {success: true, response: response?.user};
        } catch (err) {
            let message;
            switch (err.code) {
                case "auth/invalid-email":
                    message = ["Hoppla!", "Deine Email ist ungültig. Versuch's nochmal!"];
                    break;
                case "auth/email-already-in-use":
                    message = ["Bereits registriert!", "Diese E-Mailadresse ist bereits bei uns registiert, bitte logge dich ein!"];
                    break;
                case "auth/weak-password":
                    message = ["Passwort", "➡️️Dein Passwort muss mindestens 6 Zeichen haben."];
                    break;
                default:
                    message = ["Uups!", `Irgendwas lief schief: ${err.message}. Keine Panik, wir kriegen das hin!`];
            }
            return {success: false, message: message}
        }
    }

    const handleUpdateProfileImage = async (newProfileImageUri) => {
        try {
            setProfileImage(newProfileImageUri);  // Update UI immediately
            // Upload in the background
            const imageUrl = await uploadProfileImage(newProfileImageUri, user?.userId);

            await updateDoc(doc(FIRESTORE_DB, 'users', user?.userId), {
                profileImage: imageUrl
            });

            //await AsyncStorage.setItem('profileImage', imageUrl);
        } catch (err) {
            console.error("Error beim Ändern des Profilbildes: ", err);
        }
    };

    return <AuthContext.Provider value={{
        login,
        register,
        logout,
        user,
        isAuthenticated,
        profileImage,
        isAppReady,
        handleUpdateProfileImage
    }}>
        {children}
    </AuthContext.Provider>;
}

export function useAuth() {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth must be wrapped inside AuthContextProvider");
    }
    return value;
}
