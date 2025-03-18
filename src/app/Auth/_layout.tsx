import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../provider/AuthProvider";
import { supabase } from "../../lib/supabase";

export default function AuthLayout() {
  //const { session } = useAuth();

  //if (session) {
  //return <Redirect href={"../(tabs)"} />;
  //}

  return (
    <Stack>
      <Stack.Screen
        name="Login"
        //options={{ title: "Favourite" }}
      />
      <Stack.Screen
        name="SignUp"
        //options={{ title: "Favourite" }}
      />
    </Stack>
  );
}
