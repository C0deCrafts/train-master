import {View, Text, SafeAreaView} from "react-native";
import CustomHeader from "../../../components/CustomHeader";

const Index = () => {
    return (
        <View>
            <CustomHeader backButtonVisible={true}/>
            <Text>Layout</Text>
        </View>
    );
};

export default Index;