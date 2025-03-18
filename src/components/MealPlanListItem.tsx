import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, useSegments } from "expo-router";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../app/provider/AuthProvider";
import { AntDesign } from "@expo/vector-icons";
import AddToMealPlan from "./AddToMealPlan";
import dayjs from "dayjs";
import { MaterialIcons } from "@expo/vector-icons";
import AlternativeMealsModal from "./AlternativeMealsModal";

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

const deleteMeal = gql`
  mutation deleteMealMutation(
    $user_id: ID!
    $recipeId: String!
    $label: String!
    $calories: Int!
    $date: Date!
  ) {
    deleteMeal_plan(
      user_id: $user_id
      recipeId: $recipeId
      label: $label
      calories: $calories
      date: $date
    ) {
      recipeId
      label
      calories
    }
  }
`;

const searchAlternatives = gql`
  query MyQuery(
    $q: String!
    $diet: [String]
    $health: [String]
    $cuisineType: [String]
    $mealType: [String]
    $dishType: [String]
    $calories: String
    $excluded: [String]
    $random: Boolean
  ) {
    results(
      q: $q
      diet: $diet
      health: $health
      cuisineType: $cuisineType
      mealType: $mealType
      dishType: $dishType
      calories: $calories
      excluded: $excluded
      random: $random
    ) {
      count
      hits {
        _links {
          self {
            href
            title
          }
        }
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

const MealPlanListItem = ({ item, currentDate, userInput }) => {
  console.log("Item:", JSON.stringify(item, null, 2));
  const { session } = useAuth();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const pathname = usePathname();
  const [first, second] = useSegments();
  console.log("Current segment:", second);
  console.log("Current path:", pathname);
  /*const [filters, setFilters] = useState({
    dietType: [],
    healthType: [],
    cuisineType: [],
    mealType: [],
    dishType: [],
    calories: null,
    //excluded: [],
    randpm: true,
  });*/

  //const [isFavorited, setIsFavorited] = useState(false);

  const [addFavorite] = useMutation(addFavourite, {
    refetchQueries: ["getFavourites"],
  });
  const [removeFavorite] = useMutation(deleteFavourite, {
    refetchQueries: ["getFavourites"],
  });

  const extractIdFromUri = (uri) => {
    return uri.split("#recipe_").pop();
  };

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

  /*function startAddMealPlanHandler() {
    setModalIsVisible(true);
    <AddToMealPlan
      visible={modalIsVisible}
      handleAddMeal={addMealHandler}
      onCancel={endAddMealHandler}
      recipeId={recipeId}
      label={item.recipe.label}
      calories={item.recipe.calories}
    />;
  }

  function endAddMealHandler() {
    setModalIsVisible(false);
  }

  function addMealHandler() {
    endAddMealHandler();
  }*/
  const [deleteMealPlan] = useMutation(deleteMeal, {
    refetchQueries: ["getMealPlans"],
  });

  const handleDeleteMeal = async () => {
    //console.log("Meal Type:", selectedMealType);
    //console.log("Date:", formattedDate);
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");

    try {
      deleteMealPlan({
        variables: {
          user_id: session.user.id,
          recipeId: recipeId,
          //meal_type: selectedMealType,
          date: formattedDate,
          label: item.recipe.label,
          calories: item.recipe.calories,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //console.log(JSON.stringify(item.recipe, null, 2));

  const [
    runAlternative,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useLazyQuery(searchAlternatives, { fetchPolicy: "no-cache" });

  const performAlternative = (filters) => {
    console.log("filters:", filters);

    const variables = {
      q: filters.q,
      diet: filters.dietType,
      health: filters.healthType,
      cuisineType: filters.cuisineType,
      mealType: filters.mealType,
      dishType: filters.dishType,
      calories: filters.calories,
      random: filters.random,
    };

    runAlternative({ variables });
  };

  if (searchLoading) {
    return <ActivityIndicator />;
  }

  if (searchError) {
    console.log(searchError);
    return <Text>Failed to fetch data</Text>;
  }

  console.log("alternative meals:", searchData);

  const handleAlternative = () => {
    const currentFilters = {
      q: "",
      dietType: [],
      healthType: userInput.healthLabel,
      cuisineType: [],
      mealType: [],
      dishType: [],
      calories: userInput.daily_cal / 3,
      random: true,
    };
    console.log("currentFilters:", currentFilters);
    performAlternative(currentFilters);
    setModalIsVisible(true);
  };

  return (
    <Link
      href={`../${second}/${recipeId}`}
      asChild
    >
      <Pressable style={styles.container}>
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
          <TouchableOpacity onPress={handleDeleteMeal}>
            <AntDesign
              name="minuscircleo"
              size={24}
              color="royalblue"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAlternative}>
            <MaterialIcons
              name="find-replace"
              size={24}
              color="royalblue"
            />
          </TouchableOpacity>
        </View>

        {modalIsVisible && (
          <AlternativeMealsModal
            visible={modalIsVisible}
            onClose={() => setModalIsVisible(false)}
            searchLoading={searchLoading}
            searchError={searchError}
            searchData={searchData}
          />
        )}
      </Pressable>

      {/*modalIsVisible && (
          <AddToMealPlan
            visible={modalIsVisible}
            handleAddMeal={addMealHandler}
            onCancel={endAddMealHandler}
            recipeId={recipeId}
            label={item.recipe.label}
            calories={item.recipe.calories}
          />
        )*/}
    </Link>
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

export default MealPlanListItem;
