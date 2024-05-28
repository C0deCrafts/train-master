import { StyleSheet, Text, View } from 'react-native'
import {Tabs} from "expo-router";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="groups"/>
            <Tabs.Screen name="profile"/>
        </Tabs>
    );
};

export default TabsLayout;

const styles = StyleSheet.create({})