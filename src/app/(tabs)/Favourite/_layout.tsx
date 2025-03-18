import { Stack } from "expo-router";

export default function FavouriteLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="favouriteMeals"
        options={{ title: "Favourite" }}
      />
      <Stack.Screen name="[recipeId]" />
    </Stack>
  );
}
