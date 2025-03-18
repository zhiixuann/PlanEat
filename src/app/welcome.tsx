import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Link, Redirect } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "./provider/AuthProvider";

const App = () => {
  return (
    <ImageBackground
      source={require("../../assets/background7.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={require("../../assets/planeat.png")}
          style={styles.image}
        />

        <View style={styles.buttonContainer}>
          <Link
            href={"./Auth/Login"}
            asChild
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
};

export default App;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    gap: 5,
  },
  image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "purple",
    borderRadius: 20,
    padding: 10,
    margin: 5,
    width: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
  },
});
