import { Stack } from "expo-router";

export default function MealPlanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="mealPlan"
        options={{ title: "Meal Plan" }}
      />
      <Stack.Screen name="[recipeId]" />
    </Stack>
  );
}
