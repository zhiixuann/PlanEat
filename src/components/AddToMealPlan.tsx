import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker";
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import PrimaryButton from "./PrimaryButton";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "../app/provider/AuthProvider";
import { Entypo } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

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

const mealTypeOptions = ["Breakfast", "Lunch", "Dinner", "Snack"];

function AddToMealPlan(props) {
  const { session } = useAuth();
  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openMeal, setOpenMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState();
  const [mealOptions, setMealOptions] = useState(
    mealTypeOptions.map((label) => ({ label: label, value: label }))
  );

  const [addMealPlan] = useMutation(addMeal, {
    refetchQueries: ["getMealPlans"],
  });

  /*const [deleteMealPlan] = useMutation(deleteMeal, {
    refetchQueries: ["getMealPlans"],
  });*/

  const handleAddMeal = async (selectedMealType, formattedDate) => {
    // You can handle adding the meal here
    console.log("Meal Type:", selectedMealType);
    console.log("Date:", formattedDate);

    try {
      addMealPlan({
        variables: {
          user_id: session.user.id,
          recipeId: props.recipeId,
          meal_type: selectedMealType,
          date: formattedDate,
          label: props.label,
          calories: props.calories,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  console.log(props.label);
  console.log(props.calories);
  console.log(props.recipeId);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    console.log("Selected Date:", new Date(currentDate));

    console.log(dayjs(currentDate).format("YYYY-MM-DD"));
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      minimumDate: new Date(),
      maximumDate: new Date(2030, 12, 31),
    });
  };

  const mealTypeHandler = (itemValue) => {
    setSelectedMealType(itemValue);
  };

  const addMealHandler = async () => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const success = await handleAddMeal(selectedMealType, formattedDate);

    if (success) {
      Alert.alert("Meal added to meal plan successfully");
      props.onCancel(); // Close the modal
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add to Meal Plan</Text>
          <View style={styles.inputContainer}>
            <Text
              style={{
                fontSize: 15,
                marginRight: 70,
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              Date:
            </Text>

            <Entypo
              name="calendar"
              size={24}
              color="black"
              onPress={() => showMode("date")}
            />

            {showDatePicker && (
              <RNDateTimePicker
                style={styles.datePicker}
                display="calendar"
                value={date}
                onChange={onChange}
              />
            )}
          </View>
          <View>
            <Text style={styles.label}>Meal Type</Text>
            <DropDownPicker
              open={openMeal}
              value={selectedMealType}
              items={mealOptions}
              setOpen={setOpenMeal}
              setValue={setSelectedMealType}
              setItems={setMealOptions}
              placeholder={"Choose your meal type"}
              containerStyle={styles.dropdown}
              onChangeValue={(itemValue) => mealTypeHandler(itemValue)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={addMealHandler}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={props.onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  datePicker: {
    width: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  inputText: {
    fontSize: 15,
    marginTop: 16,
    fontWeight: "bold",
    marginRight: 20,
  },
  dropdown: {
    marginBottom: 15,
    width: "80%",
  },
  label: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
});

export default AddToMealPlan;
