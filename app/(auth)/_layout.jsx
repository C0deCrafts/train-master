import { StyleSheet } from 'react-native'
import {Tabs} from "expo-router";
import TabIcon from "../../components/TabIcon";
import {colors, icons} from "../../constants";
import {useAuth} from "../../context/AuthProvider";
import LogoutButton from "../../components/LogoutButton";

const TabsLayout = () => {
    const { user } = useAuth();
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.buttonBackgroundDefault,
            tabBarInactiveTintColor: colors.inactiveColor,
            tabBarStyle: {
                backgroundColor: colors.backgroundColor,
                borderTopWidth: 0,
                height: 84,
            },
            headerStyle: {
                backgroundColor: colors.backgroundColorBlueGreen,
                borderBottomWidth: 0,
                height: 120,
            },
            headerTitleStyle: {
                paddingTop: 20,
                color: colors.textColorWhite,
                fontFamily: "Poppins-SemiBold",
                fontSize: 25,
            }
        }}>
            <Tabs.Screen name="groups" options={{
                //headerShown: false,
                title: "Freunde",
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.friends}
                        color={color}
                        name="Freunde"
                        focused={focused}
                    />
                )
            }}
            redirect={!user}
            />
            <Tabs.Screen name="training" options={{
                //headerShown: false,
                title: "Training",
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.fitness}
                        color={color}
                        name="Training"
                        focused={focused}
                    />
                )
            }}
            redirect={!user}
            />
            <Tabs.Screen name="profile" options={{
                title: "Profil",
                headerRight: () => <LogoutButton/>,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.profile}
                        color={color}
                        name="Profile"
                        focused={focused}
                    />
                )
            }}
            redirect={!user}
            />
            <Tabs.Screen name="settings" options={{
                //headerShown: false,
                title: "Einstellungen",
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.setting}
                        color={color}
                        name="Einstellungen"
                        focused={focused}
                    />
                )
            }}
            redirect={!user}
            />
        </Tabs>
    );
};

export default TabsLayout;