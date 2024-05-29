import { onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../config/firebaseConfig";

const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user)=> {
            console.log("onAuthStateChanged", user);

            setUser(user);
            setInitialized(true)
        })
    }, []);

    return <AuthContext.Provider value={{ user, initialized }}>
        {children}
    </AuthContext.Provider>;
}