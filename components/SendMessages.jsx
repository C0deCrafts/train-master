import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppStyle } from "../context/AppStyleContext";

const SendMessages = forwardRef(({ handleSendMessage, onChangeText }, ref) => {
    const { getTextStyles, getColors, fontFamily } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    const styles = createStyles(textStyles, colors, fontFamily);

    return (
        <View style={styles.textInputContainer}>
            <TextInput
                onChangeText={onChangeText}
                multiline={true}
                style={styles.textInput}
                scrollEnabled={true}
                maxHeight={120}
                ref={ref}
            />
            <Pressable onPress={handleSendMessage} style={styles.button}>
                <Text style={styles.buttonLabel}>Senden</Text>
            </Pressable>
        </View>
    );
});

export default SendMessages;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        textInputContainer: {
            flexDirection: "row",
            gap: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: colors.primary,
            zIndex: 1,
            alignItems: "flex-end",
        },
        textInput: {
            flex: 1,
            color: colors.label,
            backgroundColor: colors.secondary,
            borderRadius: 10,
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.subhead,
            padding: 10,
        },
        button: {
            backgroundColor: colors.baseColor,
            borderRadius: 10,
            paddingHorizontal: 10,
            justifyContent: "center",
            height: 42.5
        },
        buttonLabel: {
            fontFamily: "Poppins-SemiBold",
            fontSize: textStyles.subhead,
            color: colors.colorButtonLabel,
        },
    });
};
