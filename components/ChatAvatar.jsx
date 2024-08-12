import {StyleSheet, View} from "react-native";
import {Image} from "expo-image";
import {blurhash} from "../utils/common";

const ChatAvatar = ({
                    imageRadius = 100,
                    imageUrl,
}) => {

    console.log("IMAGE URL: ", imageUrl)
    return (
            <View style={[styles.imageContainer, {
                width: imageRadius,
                height: imageRadius,
            }]}>
                <Image
                    source={imageUrl}
                    style={{
                        width: imageRadius,
                        height: imageRadius,
                        borderRadius: imageRadius / 2,
                        contentFit: "contain",
                    }}
                    placeholder={blurhash}
                    transition={500}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: "flex-end",
    },
})

export default ChatAvatar;