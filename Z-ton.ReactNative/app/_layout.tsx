import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./UserContext";

export default function RootLayout() {

    const [user, setUser] = useState(null);


  // Load user data from AsyncStorage when the app starts
  useEffect(() => {
    // Check for stored user data when the app starts
    const loadUser = async () => {
      try {
          const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      }
    };
    loadUser();
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Stack screenOptions={{headerShown: false}} />
    </UserContext.Provider>
  );
}
