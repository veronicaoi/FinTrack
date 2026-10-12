import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "@/screens/DashboardScreen";
import CategoriesScreen from "@/screens/CategoriesScreen";
import { colors } from "@/theme";

export type MainTabParamList = {
    Dashboard: undefined;
    Categories: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons
                        name={route.name === "Dashboard" ? "home" : "pricetags"}
                        size={size}
                        color={color}
                    />
                ),
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Categories" component={CategoriesScreen} />
        </Tab.Navigator>
    );
}