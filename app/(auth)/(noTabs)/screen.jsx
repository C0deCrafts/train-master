import {View, Text, SafeAreaView} from "react-native";
import CustomHeader from "../../../components/CustomHeader";

const Screen = () => {
    return (
        <View>
            <CustomHeader backButtonVisible={true}/>
            <Text>Screen</Text>
        </View>
    );
};

export default Screen;