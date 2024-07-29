import {Image, Pressable, StyleSheet} from 'react-native'
import {colors, icons} from "../constants";
import {signOut} from "firebase/auth";
import {FIREBASE_AUTH} from "../config/firebaseConfig";
import {useAppStyle} from "../context/AppStyleContext";

const LogoutButton = () => {
    const {getTextStyles, getColors, fontFamily, updateBaseColor, colorScheme, setColorScheme, textSize} = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    const logout = () => {
        signOut(FIREBASE_AUTH)
    };

    return (
        <Pressable onPress={logout} style={styles.container}>
            <Image source={icons.logout} style={styles.icon} />
        </Pressable>
    );
};

export default LogoutButton;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            paddingRight: 20,
            paddingTop: 20
        },
        icon: {
            width: 28,
            height: 28,
            tintColor: colors.colorButtonLabel,
        }
    })
}