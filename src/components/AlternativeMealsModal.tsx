import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import FoodListItem from "./FoodListItem";

const AlternativeMealsModal = ({
  visible,
  onClose,
  searchLoading,
  searchError,
  searchData,
}) => {
  const recipe = searchData?.results?.hits || [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Alternative Meals</Text>
        {searchLoading ? (
          <Text>Loading...</Text>
        ) : searchError ? (
          <Text>Error loading alternatives</Text>
        ) : (
          <FlatList
            data={recipe}
            renderItem={({ item }) => <FoodListItem item={item} />}
            contentContainerStyle={{ gap: 7 }}
          />
        )}
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "royalblue",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  alternativeItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  alternativeImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
});

export default AlternativeMealsModal;
