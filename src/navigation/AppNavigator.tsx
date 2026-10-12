import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import type { User } from "firebase/auth";

import LoginScreen from "@/screens/LoginScreen";
import SignUpScreen from "@/screens/SignUpScreen";
import AddTransactionScreen from "@/screens/AddTransactionScreen";
import MainTabs from "@/navigation/MainTabs";
import { subscribeToAuthChanges } from "@/services/authService";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  AddTransaction: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  if (isCheckingAuth) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? "Main" : "Login"}>
          {user ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen
                    name="AddTransaction"
                    component={AddTransactionScreen}
                    options={{ title: "Add Transaction", presentation: "modal" }}
                />
              </>
          ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Sign Up" }} />
              </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}