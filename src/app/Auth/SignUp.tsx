import { View, Text, TextInput, StyleSheet, Alert, Button } from "react-native";
import React, { useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import PrimaryButton from "../../components/PrimaryButton";
import { router } from "expo-router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
    } else {
      router.navigate("../CreateProfile");
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign Up" }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={signUpWithEmail}
          disabled={loading}
          text={loading ? "Creating Account" : "Create Account"}
        />
      </View>

      <Link
        href="./Login"
        style={styles.textButton}
      >
        Already registered? Click here to sign in!
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  label: {
    color: "gray",
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
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "purple",
    marginVertical: 10,
  },
  buttonContainer: {
    padding: 10,
    alignItems: "center",
  },
});

export default SignUp;
