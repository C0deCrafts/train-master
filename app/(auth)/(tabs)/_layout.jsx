import {Tabs} from "expo-router";
import TabIcon from "../../../components/TabIcon";
import {icons} from "../../../constants";
import {useAuth} from "../../../context/AuthProvider";
import {useAppStyle} from "../../../context/AppStyleContext";

const TabsLayout = () => {
    const { user } = useAuth();
    const { getColors, getTextStyles } = useAppStyle();
    const colors = getColors();
    const textStyles = getTextStyles();

    return (
        //miniborder irgendwo unterm header??
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            //fix label color - if the labelcolor is too light
            tabBarActiveTintColor: colors.baseColor,
            tabBarInactiveTintColor: colors.secondaryLabel,
            tabBarStyle: {
                backgroundColor: colors.primary,
                borderTopWidth: 0,
                height: 84,
                paddingHorizontal: 10
            },
            headerStyle: {
                backgroundColor: colors.baseColor,
                borderBottomWidth: 0,
                height: 120,
            },
            headerTitleStyle: {
                paddingTop: 20,
                color: colors.colorButtonLabel,
                fontFamily: "Poppins-SemiBold",
                fontSize: textStyles.title_2,
            }
        }}>
            <Tabs.Screen name="(groups)" options={{
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
            <Tabs.Screen name="(homes)" options={{
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
            <Tabs.Screen name="(training)" options={{
                headerShown: false,
                title: "Start",
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
            <Tabs.Screen name="(settings)" options={{
                headerShown: false,
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