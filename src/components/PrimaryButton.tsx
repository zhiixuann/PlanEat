import { Pressable, StyleSheet, Text, View } from "react-native";
import { forwardRef } from "react";

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const PrimaryButton = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={styles.container}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "purple",
    padding: 10,
    alignItems: "center",
    borderRadius: 100,
    width: "50%",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default PrimaryButton;
