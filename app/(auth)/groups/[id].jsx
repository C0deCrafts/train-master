import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import {useEffect} from "react";

const GroupPage = () => {
    const { id } = useLocalSearchParams();

    useEffect(() => {
        console.log("ID: ", id)
    }, []);
    return (
        <View>
            <Text>GroupPage</Text>
        </View>
    );
};

export default GroupPage;

const styles = StyleSheet.create({})