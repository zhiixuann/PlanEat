import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

const CaloriesPieChart = ({
  totalCalories,
  totalCarbs,
  totalProtein,
  totalFat,
}) => {
  const widthAndHeight = 100;
  //const consumedCalories = totalCalories; // Assuming totalCalories is the consumed calories
  //const remainingCalories = 3000 - totalCalories; // Assuming the total daily calorie intake is 2000
  const totalMacronutrients = totalCarbs + totalProtein + totalFat;

  const carbPercentage = (totalCarbs / totalMacronutrients) * 100;
  const proteinPercentage = (totalProtein / totalMacronutrients) * 100;
  const fatPercentage = (totalFat / totalMacronutrients) * 100;

  //const consumedCalories = totalCalories > 0 ? totalCalories : 1;
  const series = [carbPercentage, proteinPercentage, fatPercentage];
  const sliceColor = ["#fbd203", "#ffb300", "#ff9100"];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.45}
          coverFill={"#FFF"}
        />
        <View style={styles.legend}>
          <Text style={styles.caloriesText}>{totalCalories} kcal </Text>
          <Text style={[styles.legendItem, { color: sliceColor[0] }]}>
            {totalCarbs}g Carbs
          </Text>
          <Text style={[styles.legendItem, { color: sliceColor[1] }]}>
            {totalProtein}g Protein
          </Text>
          <Text style={[styles.legendItem, { color: sliceColor[2] }]}>
            {totalFat}g Fat
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: "600",
  },
  innerContainer: {
    flexDirection: "row",
    gap: 30,
  },
  legend: {
    flexDirection: "column",
  },
  legendItem: {
    fontSize: 15,
    marginRight: 10,
    fontWeight: "600",
  },
});

export default CaloriesPieChart;
