import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import FoodListItem from "../../../components/FoodListItem";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Link, Redirect } from "expo-router";
import PrimaryButton from "../../../components/PrimaryButton";
import CheckBox from "@react-native-community/checkbox";
import AddToMealPlan from "../../../components/AddToMealPlan";
import FilterModal from "../../../components/FilterModal";

const query = gql`
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

export default function SearchScreen() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    dietType: [],
    healthType: [],
    cuisineType: [],
    mealType: [],
    dishType: [],
    calories: null,
    random: false,
  });

  const [runSearch, { data, loading, error }] = useLazyQuery(query);

  const performSearch = (currentFilters = { newFilters: filters }) => {
    setFilters({
      dietType: [],
      healthType: [],
      cuisineType: [],
      mealType: [],
      dishType: [],
      calories: null,
      random: false,
    });

    const currentFil = currentFilters.newFilters || filters;

    console.log(currentFil);

    const variables = {
      q: search,
      diet: currentFil.dietType,
      health: currentFil.healthType,
      cuisineType: currentFil.cuisineType,
      mealType: currentFil.mealType,
      dishType: currentFil.dishType,
      calories: currentFil.calories,
      random: currentFil.random,
    };

    runSearch({ variables });

    console.log("variables:", variables);
  };

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

  console.log(data);

  const items = data?.results?.hits || [];

  // Extract the hits array
  const hitsArray = data?.results?.hits;

  // Use reduce to map the hits array into an object
  const convertedObject = hitsArray
    ? hitsArray.reduce((obj, hit, index) => {
        obj[index] = hit.recipe; // Using index as key and recipe object as value
        return obj;
      }, {})
    : {};

  console.log(convertedObject);

  const startFilterHandler = () => {
    setModalIsVisible(true);
  };

  const closeFilterHandler = () => {
    setModalIsVisible(false);
  };

  const applyFiltersHandler = (newFilters) => {
    console.log("new filter", newFilters);
    setFilters(newFilters.newFilters);
    performSearch(newFilters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputcontainer}>
        <View style={styles.input}>
          <TouchableOpacity onPress={() => performSearch()}>
            <AntDesign
              name="search1"
              size={24}
              color="black"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Start searching for meals"
          />
        </View>
        <TouchableOpacity onPress={startFilterHandler}>
          <Ionicons
            name="filter-outline"
            size={26}
            color="black"
            style={{ marginTop: 8, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      )}

      {data?.results?.count === 0 && !loading && !error && (
        <>
          <Text style={styles.noResults}>No results found.</Text>
          <Text style={styles.noResults}>
            Try searching for something else.
          </Text>
        </>
      )}

      <FlatList
        data={items}
        renderItem={({ item }) => <FoodListItem item={item} />}
        contentContainerStyle={{ gap: 7 }}
      />

      {modalIsVisible && (
        <FilterModal
          visible={modalIsVisible}
          onClose={closeFilterHandler}
          onApply={applyFiltersHandler}
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
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputcontainer: {
    flexDirection: "row",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "white",
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  clearButtonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  noResults: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
