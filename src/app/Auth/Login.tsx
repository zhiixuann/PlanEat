import { View, Text, TextInput, StyleSheet, Alert, Button } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import { supabase } from "../../lib/supabase";
import PrimaryButton from "../../components/PrimaryButton";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign In" }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        //placeholder="john@gmail.com"
        autoCapitalize={"none"}
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
          onPress={signInWithEmail}
          disabled={loading}
          text={loading ? "Signing In" : "Sign In"}
        />
      </View>
      <Link
        href="./SignUp"
        style={styles.textButton}
      >
        Click here to sign up now!
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

export default SignIn;
