import {TouchableOpacity, View, StyleSheet} from "react-native";

const ColorPicker = ({color, onPress}) => {
    const containerStyle = {
        ...styles.colorBox,
        backgroundColor: color, // Using the prop in another component for the background color
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={containerStyle}>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    colorBox: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 35,
        width: 35,
        height: 35,
    }
})

export default ColorPicker;