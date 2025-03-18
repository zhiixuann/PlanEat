import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, useRouter, useSegments } from "expo-router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../app/provider/AuthProvider";
import { AntDesign } from "@expo/vector-icons";
import AddToMealPlan from "./AddToMealPlan";

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

const FoodListItem = ({ item }) => {
  console.log("Item:", JSON.stringify(item, null, 2));
  const { session } = useAuth();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const pathname = usePathname();
  const [first, second, third] = useSegments();
  console.log("Current segment:", second);
  console.log("Current path:", pathname);
  const router = useRouter();

  //const [isFavorited, setIsFavorited] = useState(false);

  const [addFavorite] = useMutation(addFavourite, {
    refetchQueries: ["getFavourites"],
  });
  const [removeFavorite] = useMutation(deleteFavourite, {
    refetchQueries: ["getFavourites"],
  });

  function extractIdFromUri(uri) {
    return uri.split("#recipe_").pop();
  }

  const recipeId =
    item.recipe && item.recipe.uri ? extractIdFromUri(item.recipe.uri) : null;

  const { data, refetch } = useQuery(isFavouriteQuery, {
    variables: { user_id: session.user.id, recipeId: recipeId },
  });

  const isFavorited = data?.favourite_mealsByRecipeIdAndUserId?.length > 0;

  console.log(recipeId);
  //console.log(item._links.self.href);

  const onPressedSave = async () => {
    if (!recipeId) {
      // Handle case where item.recipe or item.recipe.uri is undefined
      console.error("Recipe or recipe URI is undefined");
      return;
    }

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
      // Remove from favorites
      //setIsFavorited(false);
    } else {
      // Add to favorites
      //setIsFavorited(true);
      // Perform mutation to add to favorites
      await addFavorite({
        variables: {
          user_id: session.user.id,
          label: item.recipe.label,
          calories: item.recipe.calories,
          recipeId: recipeId,
          //url: item._links.self.href,
        },
      });
    }
    refetch();
  };

  function startAddMealPlanHandler() {
    setModalIsVisible(true);
  }

  function endAddMealHandler() {
    setModalIsVisible(false);
  }

  function addMealHandler(props) {
    endAddMealHandler();
    //setModalIsVisible(false);
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: `../${second}/${recipeId}`,
          params: { fromModal: "true" },
        })
      }
    >
      <Image
        source={{ uri: item.recipe.images.THUMBNAIL.url }}
        style={{ width: 110, height: 110, borderRadius: 5, marginRight: 5 }}
      />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.label}>{item.recipe.label}</Text>
        <Text style={styles.labelText}>
          {Math.round(item.recipe.calories / item.recipe.yield)} kcal per
          serving
        </Text>
        <Text style={styles.labelText}>{item.recipe.yield} serving</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <TouchableOpacity onPress={onPressedSave}>
          <Ionicons
            name={isFavorited ? "bookmark" : "bookmark-outline"}
            size={24}
            color="royalblue"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={startAddMealPlanHandler}>
          <AntDesign
            name="pluscircleo"
            size={24}
            color="royalblue"
          />
        </TouchableOpacity>
      </View>
      {modalIsVisible && (
        <AddToMealPlan
          visible={modalIsVisible}
          handleAddMeal={addMealHandler}
          onCancel={endAddMealHandler}
          recipeId={recipeId}
          label={item.recipe.label}
          calories={item.recipe.calories}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f8",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  labelText: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
  },
});

export default FoodListItem;
