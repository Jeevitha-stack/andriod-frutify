import { StyleSheet } from "react-native";
import common from "./commonStyles";

export default StyleSheet.create({
  container: {
    ...common.center,
    backgroundColor: "#f8f9fa",
  },
  text: {
    ...common.baseText,
    color: "#222",
  },
});
