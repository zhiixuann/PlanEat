import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import MealPlanListItem from "../../../components/MealPlanListItem";
import { useCallback, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../provider/AuthProvider";
import dayjs from "dayjs";
import CaloriesPieChart from "../../../components/PieChart";
import axios from "axios";
import React from "react";
import { supabase } from "../../../lib/supabase";

const query = gql`
  query getMealPlans($user_id: ID!, $date: Date!) {
    meal_plansByUserIdandDate(user_id: $user_id, date: $date) {
      date
      recipeId
      meal_type
      result {
        recipe {
          uri
          label
          calories
          yield
          images {
            THUMBNAIL {
              url
            }
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
        }
      }
    }
  }
`;

const query2 = gql`
  query MyQuery($id: String!) {
    details(id: $id) {
      recipe {
        label
        calories
        yield
        cuisineType
        mealType
        healthLabels
        images {
          REGULAR {
            url
          }
          THUMBNAIL {
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
        shareAs
        uri
        url
      }
    }
  }
`;

const addMeal = gql`
  mutation addMealMutation(
    $user_id: ID!
    $recipeId: String!
    $meal_type: String!
    $date: Date!
    $label: String!
    $calories: Int!
  ) {
    insertMeal_plan(
      user_id: $user_id
      recipeId: $recipeId
      meal_type: $meal_type
      date: $date
      label: $label
      calories: $calories
    ) {
      recipeId
      date
      meal_type
      result {
        recipe {
          label
          calories
          yield
        }
      }
    }
  }
`;
const deleteMeal = gql`
  mutation deleteMealMutation(
    $user_id: ID!
    $recipeId: String!
    $meal_type: String!
    $date: Date!
    $label: String!
    $calories: Int!
  ) {
    deleteMeal_plan(
      user_id: $user_id
      recipeId: $recipeId
      meal_type: $meal_type
      date: $date
      label: $label
      calories: $calories
    ) {
      recipeId
      date
      meal_type
      label
      calories
    }
  }
`;

interface RecipeData {
  recipe: {
    label: string;
    calories: number;
    yield: number;
    cuisineType: string[];
    mealType: string[];
    healthLabels: string[];
    images: {
      REGULAR: { url: string };
      THUMBNAIL: { url: string };
    };
    ingredientLines: string[];
    ingredients: {
      foodId: string;
      text: string;
      food: string;
      foodCategory: string;
      image: string;
      weight: number;
    }[];
    shareAs: string;
    uri: string;
    url: string;
  };
}

interface UserInput {
  [x: string]: any;
  //username: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  lifestyle: string;
  dietaryGoal: string;
  healthLabel: [];
  //cuisineType: [];
}

export default function HomeScreen() {
  const [recipeIDs, setRecipeIDs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [section, setSection] = useState([]);
  const { session } = useAuth();
  const [generatedMeal, setGeneratedMeal] = useState([]);
  const [loadingGeneratedMeal, setLoadingGeneratedMeal] = useState(false);
  const [errorOnMeal, setErrorOnMeal] = useState(null);
  const [generateButtonClicked, setGenerateButtonClicked] = useState(false);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [random, setRandom] = useState(true);
  const [alternative, setAlternative] = useState("");
  const [sectionsData, setSectionsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { showModal: showModalParam } = useLocalSearchParams();

  const [planLength, setPlanLength] = useState(10);
  const [healthLabels, setHealthLabels] = useState([]);
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(0);
  const [breakfastDishTypes, setBreakfastDishTypes] = useState([
    "main course",
    "biscuits and cookies",
    "bread",
    "cereals",
    "pancake",
    "pastry",
    "pies and tarts",
    "preps",
    "salad",
    "preserve",
    "side dish",
    "special occasions",
    "pasta",
    "egg",
    "salad",
    "soup",
    "sandwiches",
    "pizza",
    "seafood",
  ]);
  const [lunchDishTypes, setLunchDishTypes] = useState([
    //"drinks",
    "main course",
    "special occasions",
    "pasta",
    "egg",
    "soup",
    "sandwiches",
    "pizza",
    "seafood",
  ]);
  const [dinnerDishTypes, setDinnerDishTypes] = useState([
    "main course",
    "special occasions",
    "pasta",
    "egg",
    "soup",
    "sandwiches",
    "pizza",
    "seafood",
  ]);
  const [minBreakfastCalories, setMinBreakfastCalories] = useState(0);
  const [maxBreakfastCalories, setMaxBreakfastCalories] = useState(0);
  const [minLunchCalories, setMinLunchCalories] = useState(0);
  const [maxLunchCalories, setMaxLunchCalories] = useState(0);
  const [minDinnerCalories, setMinDinnerCalories] = useState(0);
  const [maxDinnerCalories, setMaxDinnerCalories] = useState(0);
  const [loading1, setLoading1] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (showModalParam === "true") {
      return;
    }
  }, [showModalParam]);

  const fetchUserInput = async () => {
    console.log("Fetching user input...");
    const { data, error } = await supabase
      .from("health_Info")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      return;
    }
    if (data) {
      console.log("Fetched user input data:", data);
      setUserInput(data);
      setHealthLabels(data.healthLabel);
      setMinCalories(data.daily_Cal - 30);
      setMaxCalories(data.daily_Cal);
      setMinBreakfastCalories((data.daily_Cal - 30) / 3);
      setMaxBreakfastCalories(data.daily_Cal / 3);
      setMinLunchCalories((data.daily_Cal - 30) / 3);
      setMaxLunchCalories(data.daily_Cal / 3);
      setMinDinnerCalories((data.daily_Cal - 30) / 3);
      setMaxDinnerCalories(data.daily_Cal / 3);
      console.log("userInput data for fetchUserInput:", data);
      //setGenerateButtonClicked(false);
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling fetchUserInput");
    fetchUserInput();
    //setUserInput(null);
  }, []);

  const { data, loading, error } = useQuery(query, {
    variables: {
      user_id: session ? session.user.id : null,
      date: dayjs(currentDate).format("YYYY-MM-DD"),
    },
    fetchPolicy: "no-cache",
  });

  console.log("data:", data);

  const [addMealPlan] = useMutation(addMeal, {
    refetchQueries: ["getMealPlans"],
  });

  const fetchMeal = async () => {
    console.log("Fetching meal...");
    await fetchUserInput();

    /*if (!userInput) {
      console.error("User input is not set");
      return;
    }*/

    console.log("health labels:", healthLabels);
    console.log("min max cal:", minCalories, maxCalories);

    const requestData = {
      size: planLength,
      plan: {
        accept: {
          all: [
            {
              health: healthLabels,
            },
          ],
        },
        fit: {
          ENERC_KCAL: {
            min: minCalories,
            max: maxCalories,
          },
        },
        sections: {
          Breakfast: {
            accept: {
              all: [
                {
                  dish: breakfastDishTypes,
                },
                {
                  meal: ["breakfast"],
                },
              ],
            },
            fit: {
              ENERC_KCAL: {
                min: 300,
                max: maxBreakfastCalories,
              },
            },
          },
          Lunch: {
            accept: {
              all: [
                {
                  dish: lunchDishTypes,
                },
                {
                  meal: ["lunch/dinner"],
                },
              ],
            },
            fit: {
              ENERC_KCAL: {
                min: 300,
                max: maxLunchCalories,
              },
            },
          },
          Dinner: {
            accept: {
              all: [
                {
                  dish: dinnerDishTypes,
                },
                {
                  meal: ["lunch/dinner"],
                },
              ],
            },
            fit: {
              ENERC_KCAL: {
                min: 300,
                max: maxDinnerCalories,
              },
            },
          },
        },
      },
    };

    console.log("requestData:", requestData);

    try {
      const response = await axios.post(
        "https://api.edamam.com/api/meal-planner/v1/00071f28/select",
        requestData,
        {
          headers: {
            accept: "application/json",
            "Edamam-Account-User": "uhuh",
            Authorization:
              "Basic MDAwNzFmMjg6M2NiM2ViOTc1Yzg4YTU1NjZlZTM0N2YyY2I0ZmM4NDM=",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("data successfully fetched:", response.data.selection);

        const selections = response.data.selection;

        // Check if selections array is not empty
        if (!selections.length) {
          console.error("Selections array is empty:", selections);
          return;
        }

        // Randomly pick one selection
        const randomIndex = Math.floor(Math.random() * selections.length);
        const selectedSections = selections[randomIndex].sections;

        console.log("selectedsection", selectedSections);

        if (!selectedSections) {
          console.error("Invalid response format:", selections[randomIndex]);
          return;
        }

        const { Breakfast, Lunch, Dinner } = selectedSections;

        // Check if Breakfast, Lunch, and Dinner data is defined
        if (!Breakfast || !Lunch || !Dinner) {
          console.error("One of the meal sections is undefined:", {
            Breakfast,
            Lunch,
            Dinner,
          });
          return;
        }

        const recipeIDs = [
          extractIdFromUri(Breakfast.assigned),
          extractIdFromUri(Lunch.assigned),
          extractIdFromUri(Dinner.assigned),
        ];
        setRecipeIDs(recipeIDs);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const extractIdFromUri = (uri) => {
    return uri.split("#recipe_").pop();
  };

  const fetchMealData = async () => {
    try {
      setLoadingGeneratedMeal(true);
      const mealData = await Promise.all(
        recipeIDs.map((recipeID) =>
          axios<RecipeData>({
            method: "GET",
            url: `https://api.edamam.com/api/recipes/v2/${recipeID}?type=public&beta=true&app_id=00071f28&app_key=3cb3eb975c88a5566ee347f2cb4fc843`,
            headers: {
              accept: "application/json",
              "Edamam-Account-User": "uhuh",
              "Accept-Language": "en",
            },
          })
        )
      );
      setGeneratedMeal(mealData.map((data) => data.data.recipe));
    } catch (error) {
      setErrorOnMeal(error);
    } finally {
      setLoadingGeneratedMeal(false);
    }
  };

  console.log("generatedMeal:", generatedMeal);

  /*useEffect(() => {
    if (recipeIDs.length > 0 && generatedMeal.length > 0) {
      recipeIDs.forEach((recipeID) => {
        console.log(
          "Adding meal for recipe_Id from generateMealPlan:",
          recipeID
        );
        addMealHandler(recipeID, generatedMeal);
      });
    }
  }, [generatedMeal]);*/

  const addMealHandler = async (recipeId, generatedMeal) => {
    // You can handle adding the meal here
    //console.log("Meal Type:", selectedMealType);

    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    console.log("Date:", formattedDate);

    console.log("Adding meal for recipe ID from addMealhandler:", recipeId);
    console.log("Generated meal data:", generatedMeal);

    try {
      // Loop through each meal in generatedMeal
      for (const meal of generatedMeal) {
        const mealRecipeId = extractIdFromUri(meal.uri);
        if (mealRecipeId === recipeId) {
          console.log("Adding meal to the database:", meal);
          await addMealPlan({
            variables: {
              user_id: session.user.id,
              recipeId: recipeId,
              meal_type: meal.mealType.toString(),
              date: formattedDate,
              label: meal.label,
              calories: meal.calories,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateMealPlan = async () => {
    setLoadingGeneratedMeal(true);
    //await fetchAndGenerateMealPlans();
    setGenerateButtonClicked(true);
    await fetchMeal();
    await fetchMealData();
    /*if (recipeIDs.length > 0 && generateButtonClicked) {
      fetchMealData();
    }*/
    console.log("Recipe IDs:", recipeIDs);
    recipeIDs.forEach((recipeID) => {
      console.log("Adding meal for recipe_Id from generateMealPlan:", recipeID);
      addMealHandler(recipeID, generatedMeal);
    });
  };

  useEffect(() => {
    // Check if recipeIDs exist and if the generate button is clicked
    if (recipeIDs.length > 0 && generateButtonClicked) {
      fetchMealData();
    }
  }, [recipeIDs, generateButtonClicked]);

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDay);
  };

  const isTodayOrFuture = (date) => {
    const today = dayjs().startOf("day");
    const selectedDate = dayjs(date).startOf("day");
    return selectedDate.isSame(today) || selectedDate.isAfter(today);
  };

  console.log(dayjs(currentDate).format("YYYY-MM-DD"));

  /*if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    console.log(error);
    return <Text>Failed to fetch data</Text>;
  }*/

  console.log(data);

  const recipe = (data?.meal_plansByUserIdandDate || []).map(
    (meal) => meal.result
  );

  /*const mapMealPlansToSections = (mealPlans) => {
    const sections = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };

    mealPlans.forEach((mealPlan) => {
      const { meal_type, result } = mealPlan;
      sections[meal_type].push(result);
    });

    return [
      { title: "Breakfast", data: sections.breakfast },
      { title: "Lunch", data: sections.lunch },
      { title: "Dinner", data: sections.dinner },
    ];
  };*/

  const calculateTotalCalories = () => {
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;

    recipe.forEach((meal) => {
      // Ensure that meal.recipe.calories is a number
      if (typeof meal.recipe.calories === "number") {
        totalCalories += meal.recipe.calories / meal.recipe.yield;
      }

      if (typeof meal.recipe.totalNutrients.CHOCDF.quantity === "number") {
        totalCarbs +=
          meal.recipe.totalNutrients.CHOCDF.quantity / meal.recipe.yield;
      }

      if (typeof meal.recipe.totalNutrients.PROCNT.quantity === "number") {
        totalProtein +=
          meal.recipe.totalNutrients.PROCNT.quantity / meal.recipe.yield;
      }

      if (typeof meal.recipe.totalNutrients.FAT.quantity === "number") {
        totalFat += meal.recipe.totalNutrients.FAT.quantity / meal.recipe.yield;
      }
    });

    if (userInput && userInput.daily_Cal) {
      if (totalCalories > userInput.daily_Cal) {
        Alert.alert(
          "Total calories exceeded daily recommended calories!",
          "Please consider removing some meals from your current meal plan."
        );
      }
    }

    return {
      totalCalories: Math.round(totalCalories),
      totalCarbs: Math.round(totalCarbs),
      totalProtein: Math.round(totalProtein),
      totalFat: Math.round(totalFat),
    };
  };

  const { totalCalories, totalCarbs, totalProtein, totalFat } =
    calculateTotalCalories();

  const mealPlanData = data?.meal_plansByUserIdandDate || [];
  const sections = [
    {
      title: "Breakfast",
      data: mealPlanData.filter((item) => item.meal_type === "breakfast"),
    },
    {
      title: "Lunch",
      data: mealPlanData.filter((item) => item.meal_type === "lunch"),
    },
    {
      title: "Dinner",
      data: mealPlanData.filter((item) => item.meal_type === "dinner"),
    },
  ];

  console.log("sections:", sections);

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  /*const refetch = () => {
    fetchMeal();
  };*/

  /*useFocusEffect(
    useCallback(() => {
      // Refetch data when the screen is focused
      refetch();
    }, [refetch])
  );*/

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToPreviousDay}>
          <MaterialIcons
            name="navigate-before"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.dateText}>{currentDate.toDateString()}</Text>
        <TouchableOpacity onPress={goToNextDay}>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <CaloriesPieChart
        totalCalories={totalCalories}
        totalCarbs={totalCarbs}
        totalProtein={totalProtein}
        totalFat={totalFat}
      />
      {isTodayOrFuture(currentDate) && (
        <View style={styles.singlebuttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              generateMealPlan();
            }}
          >
            <Text style={styles.buttonText}>Generate Meal Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section list for meal types */}
      {/*<SectionList
        sections={[
          {
            title: "Breakfast",
            data: ["wdw"],
          },
          {
            title: "Lunch",
            data: [],
          },
          {
            title: "Dinner",
            data: [],
          },
          {
            title: "Snack",
            data: [],
          },
        ]}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item, index) => item + index}
      />*/}

      {data?.meal_plansByUserIdandDate?.length === 0 && (
        <Text style={styles.noPlanText}>No meal plan for this date.</Text>
      )}

      {/*<View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.recipeId}
            renderItem={({ item }) => (
              <MealPlanListItem
                item={item}
                //userId={session.user.id}
                currentDate={currentDate}
                userInput={userInput}
                //fetchUserInput={fetchUserInput}
                //setLoadingGeneratedMeal={setLoadingGeneratedMeal}
                //setGenerateButtonClicked={setGenerateButtonClicked}
              />
            )}
            renderSectionHeader={renderSectionHeader}
          />
        )}
      </View>*/}

      {loadingGeneratedMeal && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      )}
      {error && <Text>Error: {errorOnMeal}</Text>}

      <View style={styles.container}>
        <FlatList
          data={recipe}
          renderItem={({ item }) => (
            <MealPlanListItem
              item={item}
              currentDate={currentDate}
              userInput={userInput}
            />
          )}
          contentContainerStyle={{ gap: 7 }}
        />
      </View>

      {/*loadingGeneratedMeal && <ActivityIndicator />}
        {errorOnMeal && <Text>Failed to fetch data</Text>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 5,
    gap: 10,
  },
  scrollViewContainer: {
    backgroundColor: "white",
    flex: 1,
    padding: 5,
    gap: 7,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    color: "dimgray",
    textAlign: "center",
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "80%",
    marginTop: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  sectionHeader: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  singlebuttonContainer: {
    alignItems: "center",
    marginTop: 10,
    width: "50%",
    alignSelf: "center",
  },
  header: {
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
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
  noPlanText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
});
