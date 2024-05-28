import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {colors, icons} from "../constants";
import {useState} from "react";

const FormField = ({label, value, placeholder, handleChangeText, otherStyles, isPassword=false, isLabel=false,...props}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={otherStyles}>
            {isLabel && (
                <Text style={styles.text}>{label}</Text>
            )}
            <View style={[styles.formContainer, isFocused && styles.focused]}>
                <TextInput
                    style={styles.textInputContainer}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={"rgba(30,30,30,0.5)"}
                    onChangeText={handleChangeText}
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.lock : icons.unlock}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;

const styles = StyleSheet.create({
    text: {
        color: colors.textColorWhite,
        fontFamily: "Poppins-Light",
        marginBottom: 8,
    },
    textInputContainer: {
        flex: 1,
        color: colors.textColorDark,
        fontFamily: "Poppins-Regular",
        fontSize: 14,
    },
    formContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        borderRadius: 10,
        paddingHorizontal: 20,
        backgroundColor: "rgba(255,255,255,0.7)",
    },
    focused: {
        borderWidth: 1,
        borderColor: colors.buttonBackgroundDefault,
    },
    icon: {
        width: 20,
        height: 20
    }
})