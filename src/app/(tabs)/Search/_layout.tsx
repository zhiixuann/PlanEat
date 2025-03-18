import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="searchRecipe"
        options={{ title: "Search" }}
      />
      <Stack.Screen name="[recipeId]" />
    </Stack>
  );
}
