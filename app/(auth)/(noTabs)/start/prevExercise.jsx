import {View, Text, SafeAreaView} from "react-native";
import {useLocalSearchParams} from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const PrevExercise = () => {
    const { exercises, currentIndex, timeLeft } = useLocalSearchParams();

    return (
        <View>
            <CustomHeader backButtonVisible={true}/>
            <Text>OUTSIDE</Text>
            <Text>Prev</Text>
            <Text>curIn: {currentIndex}</Text>
            <Text>timeLeft: {timeLeft}</Text>
        </View>
    );
};

export default PrevExercise;