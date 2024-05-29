import {Image, StyleSheet, Text, View} from "react-native";

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View style={styles.container}>
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                style={{
                    width: 25,
                    height: 25,
                }}
            />
            <Text style={[styles.text, focused && styles.focusedText, { color: color }]}>
                {name}
            </Text>
        </View>
    )
}

export default TabIcon;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        gap: 2
    },
    text: {
        fontSize: 12,
        fontFamily: "Poppins-Light"
    },
    focusedText: {
        fontFamily: "Poppins-Light"
    }
})