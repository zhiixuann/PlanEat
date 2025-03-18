import { Slot, Stack } from "expo-router";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import AuthProvider from "./provider/AuthProvider";
import client from "./provider/ApolloProvider";
import React from "react";

export default function RootLayoutNav() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="welcome"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateProfile"
            options={{ title: " Create Your Profile Now!" }}
          />
        </Stack>
      </ApolloProvider>
    </AuthProvider>
  );
}
