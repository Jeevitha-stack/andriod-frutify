import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import footerStyles from "../styles/Footerstyles";

const Footer = ({ activeScreen, setActiveScreen }) => {
  const buttons = [
    { name: "Home", icon: "home" },
    { name: "Profile", icon: "user" },
  ];

  return (
    <View style={footerStyles.container}>
      {buttons.map((btn) => (
        <TouchableOpacity key={btn.name} onPress={() => setActiveScreen(btn.name)}>
          <Icon
            name={btn.icon}
            size={28}
            color={activeScreen === btn.name ? "#00bfff" : "#bbb"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Footer;
