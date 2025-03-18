import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  BackHandler,
  Button,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/PrimaryButton";
import AddToMealPlan from "../../../components/AddToMealPlan";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../provider/AuthProvider";

const query = gql`
  query MyQuery($id: String!) {
    details(id: $id) {
      recipe {
        label
        calories
        yield
        cuisineType
        mealType
        healthLabels
        dietLabels
        dishType
        images {
          REGULAR {
            url
          }
        }
        ingredientLines
        ingredients {
          foodId
          text
          food
          foodCategory
          image
          weight
        }
        totalNutrients {
          FAT {
            label
            quantity
            unit
          }
          PROCNT {
            label
            quantity
            unit
          }
          CHOCDF {
            label
            quantity
            unit
          }
        }
        shareAs
        uri
        url
      }
    }
  }
`;

const addFavourite = gql`
  mutation addFavMutation(
    $user_id: ID!
    $recipeId: String!
    $label: String!
    $calories: Int!
  ) {
    insertFavourite_meal(
      user_id: $user_id
      recipeId: $recipeId
      label: $label
      calories: $calories
    ) {
      user_id
      recipeId
      label
      calories
    }
  }
`;

const deleteFavourite = gql`
  mutation deleteFavMutation(
    $user_id: ID!
    $recipeId: String!
    $label: String!
    $calories: Int!
  ) {
    deleteFavourite_meal(
      user_id: $user_id
      recipeId: $recipeId
      label: $label
      calories: $calories
    ) {
      user_id
      recipeId
      label
      calories
    }
  }
`;

const isFavouriteQuery = gql`
  query MyQuery($user_id: ID!, $recipeId: String!) {
    favourite_mealsByRecipeIdAndUserId(user_id: $user_id, recipeId: $recipeId) {
      id
      user_id
      recipeId
    }
  }
`;

const FoodDetailsScreen = ({ item }) => {
  const { session } = useAuth();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { recipeId } = useLocalSearchParams();

  const [addFavorite] = useMutation(addFavourite, {
    refetchQueries: ["getFavourites"],
  });
  const [removeFavorite] = useMutation(deleteFavourite, {
    refetchQueries: ["getFavourites"],
  });

  const { data: isFavoritedData, refetch } = useQuery(isFavouriteQuery, {
    variables: { user_id: session.user.id, recipeId: recipeId },
  });

  const isFavorited =
    isFavoritedData?.favourite_mealsByRecipeIdAndUserId?.length > 0;

  const onSave = async () => {
    if (!recipeId) {
      // Handle case where item.recipe or item.recipe.uri is undefined
      console.error("Recipe or recipe URI is undefined");
      return;
    }
    //console.log("recipe", item.recipe);

    if (isFavorited) {
      // Perform mutation to remove from favorites
      await removeFavorite({
        variables: {
          user_id: session.user.id,
          label: item.recipe.label,
          calories: item.recipe.calories,
          recipeId: recipeId,
        },
      });
    } else {
      // Perform mutation to add to favorites
      await addFavorite({
        variables: {
          user_id: session.user.id,
          label: item.recipe.label,
          calories: item.recipe.calories,
          recipeId: recipeId,
        },
      });
    }
    refetch();
  };

  const startAddMealPlanHandler = () => {
    setModalIsVisible(true);
  };

  const endAddMealHandler = () => {
    setModalIsVisible(false);
  };

  const addMealHandler = () => {
    endAddMealHandler();
  };

  if (!recipeId) {
    return <Text>No recipeId provided</Text>;
  }

  console.log("recipe ID:", recipeId);

  const { loading, error, data } = useQuery(query, {
    variables: { id: recipeId },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }
  if (error) return <Text>Error: {error.message}</Text>;

  const recipe = data.details.recipe;

  if (!recipe) return <Text>No recipe found for: {recipeId}</Text>;

  console.log("Recipe:", recipe);

  const handleRecipeLinkPress = () => {
    Linking.openURL(recipe.url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: recipe.label }} />
      <Image
        source={{ uri: recipe.images.REGULAR.url }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTitle}>{recipe.label}</Text>
      <Text style={styles.textDetails}>
        Total Calories: {Math.round(recipe.calories)} kcal
      </Text>
      <Text style={styles.textDetails}>Yield: {recipe.yield} serving</Text>
      <Text style={styles.textDetails}>
        {Math.round(recipe.calories / recipe.yield)} kcal per serving
      </Text>
      <View style={styles.nutrientContainer}>
        <Text style={styles.nutrientText}>Nutritional Info</Text>
        <Text style={styles.nutrientText}>
          {recipe.totalNutrients.CHOCDF.label}:{" "}
          {Math.round(recipe.totalNutrients.CHOCDF.quantity)}{" "}
          {recipe.totalNutrients.CHOCDF.unit}
        </Text>
        <Text style={styles.nutrientText}>
          {recipe.totalNutrients.PROCNT.label}:{" "}
          {Math.round(recipe.totalNutrients.PROCNT.quantity)}{" "}
          {recipe.totalNutrients.PROCNT.unit}
        </Text>
        <Text style={styles.nutrientText}>
          {recipe.totalNutrients.FAT.label}:{" "}
          {Math.round(recipe.totalNutrients.FAT.quantity)}{" "}
          {recipe.totalNutrients.FAT.unit}
        </Text>
      </View>
      <Text style={styles.textDetails}>{recipe.yield} serving</Text>
      <Text style={styles.textDetails}>Cuisine Type: {recipe.cuisineType}</Text>
      <Text style={styles.textDetails}>Meal Type: {recipe.mealType}</Text>
      <Text style={styles.textDetails}>Dish Type: {recipe.dishType}</Text>
      <Text style={styles.textDetails}>Diet Labels: </Text>
      <View style={styles.labelContainer}>
        {recipe.dietLabels.map((label, index) => (
          <Text
            style={styles.healthLabel}
            key={index}
          >
            {label}
          </Text>
        ))}
      </View>
      <Text style={styles.textDetails}>Health Labels: </Text>
      <View style={styles.labelContainer}>
        {recipe.healthLabels.map((label, index) => (
          <Text
            style={styles.healthLabel}
            key={index}
          >
            {label}
          </Text>
        ))}
      </View>
      <Text style={styles.textDetails}>Ingredients: </Text>
      <View style={styles.ingredientContainer}>
        {recipe.ingredients.map((ingredient, index) => (
          <View
            style={styles.ingredientCard}
            key={index}
          >
            {ingredient.image && (
              <Image
                source={{ uri: ingredient.image }}
                style={styles.ingredientImage}
              />
            )}
            <Text style={styles.ingredientText}>{ingredient.text}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={handleRecipeLinkPress}>
        <Text style={styles.recipeLink}>{recipe.url}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={startAddMealPlanHandler}
        >
          <Text style={styles.buttonText}>Add to Meal Plan</Text>
        </TouchableOpacity>
      </View>
      {modalIsVisible && (
        <AddToMealPlan
          visible={modalIsVisible}
          handleAddMeal={addMealHandler}
          onCancel={endAddMealHandler}
          recipeId={recipeId}
          label={recipe.label}
          calories={recipe.calories}
        />
      )}
      {/*<Ionicons
        onPress={onSave}
        name={isFavorited ? "bookmark" : "bookmark-outline"}
        size={24}
        color="royalblue"
        style={styles.bookmarkIcon}
    />*/}
    </ScrollView>
  );
};

export default FoodDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  recipeImage: {
    alignSelf: "center",
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 20,
  },
  recipeTitle: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  textDetails: {
    color: "#666",
    fontSize: 18,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  labelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  healthLabel: {
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    padding: 8,
    margin: 4,
    borderRadius: 8,
    fontSize: 14,
  },
  ingredientContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  ingredientCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  ingredientImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  ingredientText: {
    color: "#333",
    fontSize: 16,
    flex: 1,
  },
  nutrientContainer: {
    marginHorizontal: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  nutrientText: {
    color: "#333",
    fontSize: 18,
    marginBottom: 10,
  },
  recipeLink: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    marginTop: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "purple",
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bookmarkIcon: {
    alignSelf: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
