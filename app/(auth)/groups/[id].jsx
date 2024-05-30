import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import {useEffect} from "react";
import CustomHeader from "../../../components/CustomHeader";

const GroupPage = () => {
    const { id, name } = useLocalSearchParams();

    useEffect(() => {
        console.log("ID: ", id)
    }, []);
    return (
        <View style={styles.container}>
            <CustomHeader title={name} backButtonVisible={true}/>
            <Text>GroupPage</Text>
        </View>
    );
};

export default GroupPage;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        top: 0,
        left: 0
    }
})