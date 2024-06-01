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
                headerShown: false,
                title: "Gruppen",
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.friends}
                        color={color}
                        name="Freunde"
                        focused={focused}
                    />
                ),
                headerShadowVisible: false
            }}
            redirect={!user}
            />
            <Tabs.Screen name="home" options={{
                headerShown: false,
                title: "Home",
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.profile}
                        color={color}
                        name="Home"
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
            <Tabs.Screen name="settings" options={{
                //headerShown: false,
                title: "Menü",
                headerRight: () => <LogoutButton/>,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon
                        icon={icons.menu}
                        color={color}
                        name="Menü"
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