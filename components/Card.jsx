import React from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useAppStyle} from "../context/AppStyleContext";
import {Link} from "expo-router";
import {appStyles} from "../constants/elementStyles";

const Card = ({ clickable, href, onPress, style, children, ...props }) => {
    const { getColors } = useAppStyle();
    const colors = getColors();

    const styles = createStyles(colors);

    if (clickable && href) {
        return (
            <View style={[styles.card, style]}>
                <Link href={href} key={props.id} asChild >
                    <TouchableOpacity>
                        {children}
                    </TouchableOpacity>
                </Link>
            </View>
        );
    } else if (clickable && onPress) {
        return (
            <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={[styles.card, style]}>{children}</View>
};

const createStyles = (colors) => {
    return StyleSheet.create({
        card: {
            padding: appStyles.cardPadding,
            marginBottom: appStyles.spacingVerticalSmall,
            backgroundColor: colors.secondary,
            borderRadius: appStyles.cardRadius,
        },
    });
}

export default Card;