import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";

const RecipeItem = ({ recipe }) => {
  const handleRecipePress = () => {
    // Open the recipe link in the default browser
    if (recipe.url) {
      Linking.openURL(recipe.url);
    } else {
      console.log("Recipe URL is not available");
      // You can display a message to inform the user
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRecipePress}>
        <Text style={styles.recipeLink}>{recipe.url}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  recipeLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default RecipeItem;
