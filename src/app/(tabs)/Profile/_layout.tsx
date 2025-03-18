import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { supabase } from "../../../lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    console.log("Successfully logged out");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Pressable
            onPress={handleLogout}
            style={{ marginRight: 10 }}
          >
            <MaterialIcons
              name="logout"
              size={24}
              color="black"
            />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="userProfile"
        options={{ title: "Profile" }}
      />
    </Stack>
  );
}
