import {
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import PrimaryButton from "../components/PrimaryButton";
import { Link, Redirect } from "expo-router";
import { useAuth } from "./provider/AuthProvider";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";

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

const genderOptions = ["Male", "Female"];

const dietaryGoalOptions = [
  { goal: "mildlose", displayName: "Lose Mild Weight (0.25kg a week)" },
  { goal: "weightlose", displayName: "Lose Weight (0.5kg a week)" },
  { goal: "maintain", displayName: "Maintain Weight" },
  { goal: "mildgain", displayName: "Gain Mild Weight (0.25kg a week)" },
  { goal: "weightgain", displayName: "Gain Weight (0.5kg a week)" },
];

const lifestyleOptions = [
  { level: "1", displayName: "Sedentary (Little or no exercise)" },
  {
    level: "2",
    displayName: "Lightly Active (Exercise 1 - 3 days/week)",
  },
  {
    level: "3",
    displayName: "Moderately Active (Exercise 4 - 5 days/week)",
  },
  {
    level: "4",
    displayName: "Very active (Exercise 6-7 days/week)",
  },
  {
    level: "5",
    displayName:
      "Super active (Very hard exercise/sports daily or physical job)",
  },
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
  "low-fat-abs",
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

export default function CreateProfileScreen() {
  const [user, setUser] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);
  const [value4, setValue4] = useState(null);
  const [healthLabel, sethealthLabel] = useState(
    healthLabelOptions.map((label) => ({ label: label, value: label }))
  );
  const [dietaryGoal, setDietaryGoal] = useState(
    dietaryGoalOptions.map((label) => ({
      label: label.displayName,
      value: label.goal,
    }))
  );
  const [lifestyle, setLifestyle] = useState(
    lifestyleOptions.map((label) => ({
      label: label.displayName,
      value: label.level,
    }))
  );
  const [gender, setGender] = useState(
    genderOptions.map((label) => ({ label: label, value: label }))
  );

  const [userInput, setUserInput] = useState<UserInput>({
    //username: "",
    age: 0,
    height: 0,
    weight: 0,
    gender: "",
    lifestyle: "",
    dietaryGoal: "",
    healthLabel: [],
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  const handleChange = async (
    name: keyof UserInput,
    value: string | number | string[]
  ) => {
    console.log("Handling change for:", name, "with value:", value);

    setUserInput((prevUserInput) => ({
      ...prevUserInput,
      [name]: value, // Update the state directly
    }));
  };

  const validateForm = () => {
    const { age, height, weight, gender, lifestyle, dietaryGoal } = userInput;

    if (!age || age < 1 || age > 80) {
      Alert.alert("Invalid age", "Age must be between 1 and 80.");
      return false;
    }

    if (!height || height < 130 || height > 230) {
      Alert.alert(
        "Invalid height",
        "Height must be between 130 cm and 230 cm."
      );
      return false;
    }

    if (!weight || weight < 40 || weight > 230) {
      Alert.alert("Invalid weight", "Weight must be between 40 kg and 230 kg.");
      return false;
    }

    if (!gender) {
      Alert.alert("Invalid gender", "Gender must be selected.");
      return false;
    }

    if (!lifestyle) {
      Alert.alert("Invalid lifestyle", "Activity level must be selected.");
      return false;
    }

    if (!dietaryGoal) {
      Alert.alert("Invalid dietary goal", "Dietary goal must be selected.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    console.log("User Input:", userInput);

    if (!validateForm()) {
      return;
    }
    // Here you can send the userInput to your backend or perform any other action
    try {
      // Ensure all required fields are filled
      if (!user || !user.id) {
        Alert.alert("User not found");
        return;
      }

      // Construct the data object to be inserted into the table
      const dataToInsert = {
        user_id: user.id,
        ...userInput,
      };

      // Execute the SQL insert operation
      const { error } = await supabase
        .from("health_Info")
        .insert([dataToInsert]);

      if (error) {
        throw error;
      }

      Alert.alert("Profile successfully created");
      router.navigate("/(tabs)/MealPlan");
    } catch (error) {
      console.error("Error creating profile:", error.message);
      Alert.alert("An error occurred while creating profile");
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age (years old):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userInput.age.toString()}
              onChangeText={(value) => handleChange("age", Number(value))}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Height (cm):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userInput.height.toString()}
              onChangeText={(value) => handleChange("height", Number(value))}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight (kg):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userInput.weight.toString()}
              onChangeText={(value) => handleChange("weight", Number(value))}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender:</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              placeholder={"Choose your gender"}
              open={open4}
              setOpen={setOpen4}
              items={gender}
              setItems={setGender}
              value={value4}
              setValue={setValue4}
              zIndex={4000}
              zIndexInverse={1000}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onChangeValue={(value4) => handleChange("gender", value4)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Activity Level:</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              placeholder={"What is your current lifestyle?"}
              open={open3}
              setOpen={setOpen3}
              items={lifestyle}
              setItems={setLifestyle}
              value={value3}
              setValue={setValue3}
              zIndex={3000}
              zIndexInverse={2000}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onChangeValue={(value3) => handleChange("lifestyle", value3)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dietary Goal:</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              placeholder={"Choose your dietary goal"}
              open={open2}
              setOpen={setOpen2}
              items={dietaryGoal}
              setItems={setDietaryGoal}
              value={value2}
              setValue={setValue2}
              zIndex={2000}
              zIndexInverse={3000}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onChangeValue={(value1) => handleChange("dietaryGoal", value1)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dietary Preferences:</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              placeholder={"Choose your dietary preferences"}
              open={open1}
              setOpen={setOpen1}
              items={healthLabel}
              setItems={sethealthLabel}
              value={value1}
              setValue={setValue1}
              multiple={true}
              min={0}
              max={healthLabel.length}
              zIndex={1000}
              zIndexInverse={4000}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              mode="BADGE"
              badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#8ac926"]}
              onChangeValue={(value1) => handleChange("healthLabel", value1)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              text="Done"
              onPress={handleSubmit}
              style={styles.updateButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  label: {
    color: "#333",
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 10,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    gap: 14,
  },
  inputContainer: {
    marginBottom: 10,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
});
