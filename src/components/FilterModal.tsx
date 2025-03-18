import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const dietTypeOptions = [
  "balanced",
  "high-fiber",
  "high-protein",
  "low-carb",
  "low-fat",
  "low-sodium",
];

const healthLabelOptions = [
  "alcohol-free",
  "celery-free",
  "crustacean-free",
  "dairy-free",
  "DASH",
  "egg-free",
  "fish-free",
  "fodmap-free",
  "gluten-free",
  "immuno-supportive",
  "keto-friendly",
  "kidney-friendly",
  "kosher",
  "low-potassium",
  "low-sugar",
  "lupine-free",
  "Mediterranean",
  "mollusk-free",
  "mustard-free",
  "no-oil-added",
  "paleo",
  "peanut-free",
  "pescatarian",
  "pork-free",
  "red-meat-free",
  "sesame-free",
  "shellfish-free",
  "soy-free",
  "sugar-conscious",
  "sulfite-free",
  "tree-nut-free",
  "vegan",
  "vegetarian",
  "wheat-free",
];

const cuisineTypeOptions = [
  "American",
  "Asian",
  "British",
  "Caribbean",
  "Central Europe",
  "Chinese",
  "Eastern Europe",
  "French",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Kosher",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "South American",
  "South East Asian",
];

const mealTypeOptions = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Snack",
  "Teatime",
];

const dishTypeOptions = [
  "Biscuits and cookies",
  "Bread",
  "Cereals",
  "Condiments and sauces",
  "Desserts",
  "Drinks",
  "Main course",
  "Pancake",
  "Preps",
  "Preserve",
  "Salad",
  "Sandwiches",
  "Side dish",
  "Soup",
  "Starter",
  "Sweets",
];

const FilterModal = ({ visible, onClose, onApply }) => {
  const [openDiet, setOpenDiet] = useState(false);
  const [diet, setDiet] = useState([]);
  const [dietOptions, setDietOptions] = useState(
    dietTypeOptions.map((label) => ({ label: label, value: label }))
  );

  const [openHealth, setOpenHealth] = useState(false);
  const [health, setHealth] = useState([]);
  const [healthOptions, setHealthOptions] = useState(
    healthLabelOptions.map((label) => ({ label: label, value: label }))
  );

  const [openCuisine, setOpenCuisine] = useState(false);
  const [cuisine, setCuisine] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState(
    cuisineTypeOptions.map((label) => ({ label: label, value: label }))
  );

  const [openMeal, setOpenMeal] = useState(false);
  const [meal, setMeal] = useState([]);
  const [mealOptions, setMealOptions] = useState(
    mealTypeOptions.map((label) => ({
      label: label,
      value: label.toLowerCase(),
    }))
  );

  const [openDish, setOpenDish] = useState(false);
  const [dish, setDish] = useState([]);
  const [dishOptions, setDishOptions] = useState(
    dishTypeOptions.map((label) => ({ label: label, value: label }))
  );

  const [cal, setCal] = useState("");
  const [random, setRandom] = useState(false);

  const applyFilters = () => {
    const newFilters = {
      dietType: diet || [],
      healthType: health || [],
      cuisineType: cuisine || [],
      mealType: meal || [],
      dishType: dish || [],
      calories: cal || [],
      random: random,
    };
    onApply({ newFilters });
    onClose();
  };

  const resetFilters = () => {
    setDiet([]);
    setHealth([]);
    setCuisine([]);
    setMeal([]);
    setDish([]);
    setCal("");
    setRandom(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Filter Options</Text>

          <Text style={styles.label}>Diet Type</Text>
          <DropDownPicker
            open={openDiet}
            value={diet}
            items={dietOptions}
            setOpen={setOpenDiet}
            setValue={setDiet}
            setItems={setDietOptions}
            multiple={true}
            placeholder={"Choose your diet"}
            containerStyle={styles.dropdown}
            min={0}
            max={dietTypeOptions.length}
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#8ac926"]}
            zIndex={5000}
            zIndexInverse={1000}
          />

          <Text style={styles.label}>Health Preference</Text>
          <DropDownPicker
            open={openHealth}
            value={health}
            items={healthOptions}
            setOpen={setOpenHealth}
            setValue={setHealth}
            setItems={setHealthOptions}
            multiple={true}
            listMode="SCROLLVIEW"
            placeholder="Choose your health preference"
            containerStyle={styles.dropdown}
            //dropDownDirection="TOP"
            min={0}
            max={healthLabelOptions.length}
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#8ac926"]}
            zIndex={4000}
            zIndexInverse={2000}
          />

          <Text style={styles.label}>Cuisine Type</Text>
          <DropDownPicker
            open={openCuisine}
            value={cuisine}
            items={cuisineOptions}
            setOpen={setOpenCuisine}
            setValue={setCuisine}
            setItems={setCuisineOptions}
            multiple={true}
            placeholder={"Choose your cuisine type"}
            containerStyle={styles.dropdown}
            min={0}
            max={cuisineTypeOptions.length}
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#8ac926"]}
            zIndex={3000}
            zIndexInverse={3000}
          />

          <Text style={styles.label}>Meal Type</Text>
          <DropDownPicker
            open={openMeal}
            value={meal}
            items={mealOptions}
            setOpen={setOpenMeal}
            setValue={setMeal}
            setItems={setMealOptions}
            multiple={true}
            placeholder={"Choose your meal type"}
            containerStyle={styles.dropdown}
            min={0}
            max={mealTypeOptions.length}
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#8ac926"]}
            zIndex={2000}
            zIndexInverse={4000}
          />

          <Text style={styles.label}>Dish Type</Text>
          <DropDownPicker
            open={openDish}
            value={dish}
            items={dishOptions}
            setOpen={setOpenDish}
            setValue={setDish}
            setItems={setDishOptions}
            multiple={true}
            placeholder={"Choose your dish type"}
            containerStyle={styles.dropdown}
            min={0}
            max={dishTypeOptions.length}
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#8ac926"]}
            zIndex={1000}
            zIndexInverse={5000}
          />

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter calories (e.g.: 100-300, 300)"
            value={cal}
            onChangeText={(value) => setCal(value)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={applyFilters}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                resetFilters();
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  dropdown: {
    marginBottom: 15,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    width: "100%",
  },
  button: {
    backgroundColor: "royalblue",
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default FilterModal;
