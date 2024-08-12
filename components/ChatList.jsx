import React from 'react';
import {StyleSheet, FlatList} from "react-native";
import elementStyles from "../constants/elementStyles";
import {useAppStyle} from "../context/AppStyleContext";
import Card from "./Card";
import ChatItem from "./ChatItem";
import {useRouter} from "expo-router";

const ChatList = ({users, currentUser}) => {
    const {getTextStyles, getColors, fontFamily} = useAppStyle();
    const textStyles = getTextStyles();
    const colors = getColors();
    const styles = createStyles(textStyles, colors, fontFamily);

    const router = useRouter();

    return (
        <Card style={styles.container}>
            <FlatList
                data={users}
                renderItem={({item, index}) => <ChatItem
                    noBorder={index+1 === users.length}
                    router={router}
                    item={item}
                    key={index}
                    currentUser={currentUser}
                />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </Card>
    );
};

export default ChatList;

const createStyles = (textStyles, colors, fontFamily) => {
    return StyleSheet.create({
        container: {
            marginTop: 10,
            backgroundColor: "transparent"
        },
        content: {
            paddingHorizontal: elementStyles.spacingHorizontalDefault,
        },
        text: {
            fontFamily: fontFamily.Poppins_Regular,
            fontSize: textStyles.label,
            color: colors.label
        },
    })
}