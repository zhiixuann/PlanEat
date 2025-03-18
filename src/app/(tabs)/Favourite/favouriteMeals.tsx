import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "../../provider/AuthProvider";
import FoodListItem from "../../../components/FoodListItem";

const query = gql`
  query getFavourites($user_id: ID!) {
    favourite_meals(user_id: $user_id) {
      user_id
      recipeId
      label
      result {
        recipe {
          label
          calories
          yield
          uri
          images {
            THUMBNAIL {
              url
            }
          }
        }
      }
    }
  }
`;

export default function favouriteMeals() {
  // Get the user profile from the AuthProvider
  const { session } = useAuth();

  const { data, loading, error } = useQuery(query, {
    variables: {
      user_id: session ? session.user.id : null,
    },
  });

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
      />
    );
  }
  if (error) {
    console.log(error);
    return <Text>Failed to fetch data</Text>;
  }

  console.log("current data", data);

  const recipe = (data?.favourite_meals || []).map((fav) => fav.result);

  return (
    <View style={styles.container}>
      {recipe.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favourite meals yet</Text>
      ) : (
        <FlatList
          data={recipe}
          renderItem={({ item }) => <FoodListItem item={item} />}
          contentContainerStyle={{ gap: 7 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  noFavoritesText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    marginTop: 20,
  },
});
