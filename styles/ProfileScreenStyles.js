import { StyleSheet } from "react-native";
import common from "./commonStyles";

export default StyleSheet.create({
  container: {
    ...common.center,
    backgroundColor: "#f0f0f0",
  },
  text: {
    ...common.baseText,
    color: "#333",
  },
});
