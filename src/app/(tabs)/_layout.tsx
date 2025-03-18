import React from "react";
import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../provider/AuthProvider";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <FontAwesome
      size={20}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href={"../welcome"} />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="MealPlan"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="cutlery"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Favourite"
        options={{
          headerShown: false,
          title: "Favourite",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="bookmark"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="search"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="user"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
