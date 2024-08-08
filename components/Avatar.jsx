import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import {icons, images} from "../constants";
import {useAppStyle} from "../context/AppStyleContext";
import {useAccountSetting} from "../context/AccountSettingContext";

const Avatar = ({isPressableDisabled = false, isCameraVisible = true, imageRadius = 100}) => {
    const {getColors} = useAppStyle();
    const colors = getColors();

    const { profileImage, handleProfileImageChange } = useAccountSetting();

    return (
        <TouchableOpacity onPress={handleProfileImageChange} style={{zIndex: 2}} disabled={isPressableDisabled}>
            <View style={[styles.imageContainer, {
                width: imageRadius,
                height: imageRadius,
            }]}>
                <Image
                    source={profileImage || images.avatar}
                    style={{
                        width: imageRadius,
                        height: imageRadius,
                        borderRadius: imageRadius / 2,
                        contentFit: "contain",
                    }}
                />
                {isCameraVisible &&(
                    <View style={styles.cameraStyle}>
                        <Image source={icons.camera} style={{
                            width: imageRadius / 4,
                            height: imageRadius / 4,
                            tintColor: colors.label
                        }}/>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
        imageContainer: {
            alignItems: "flex-end",
        },
        cameraStyle: {
            flex: 1,
            justifyContent: "flex-end",
        },
    })

export default Avatar;