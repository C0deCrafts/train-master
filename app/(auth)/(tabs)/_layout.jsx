import {Tabs} from "expo-router";
import TabIcon from "../../../components/TabIcon";
import {icons} from "../../../constants";
import {useAuth} from "../../../context/AuthContext";
import {useAppStyle} from "../../../context/AppStyleContext";
import {appStyles} from "../../../constants/elementStyles";

const TabsLayout = () => {
    const { user } = useAuth();
    const { getColors } = useAppStyle();
    const colors = getColors();

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
                paddingHorizontal: appStyles.spacingHorizontalTabBar,
            },
        }}>
            <Tabs.Screen name="(chat)" options={{
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
                ),
                headerShadowVisible: false,
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
                ),
                headerShadowVisible: false
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
                ),
                headerShadowVisible: false
            }}
            redirect={!user}
            />
        </Tabs>
    );
};

export default TabsLayout;