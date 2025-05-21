import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss: () => void;
};

export const CustomAlert = ({ visible, title, message, buttons = [{ text: "OK" }], onDismiss }: CustomAlertProps) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onDismiss();
  };

  if (Platform.OS === "web") {
    if (!visible) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: backgroundColor,
            borderRadius: 8,
            padding: 20,
            maxWidth: 400,
            width: "90%",
          }}
        >
          <h3 style={{ color: textColor, marginBottom: 45, textAlign: "center", fontFamily: "Merriweather" }}>{title}</h3>
          <p style={{ color: textColor, marginBottom: 45, textAlign: "center" }}>{message}</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleButtonPress(button)}
                style={{
                  backgroundColor: primaryColor,
                  fontSize: 16,
                  fontFamily: "Merriweather",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  padding: "10px 15px",
                  marginLeft: 10,
                  cursor: "pointer",
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, { backgroundColor: primaryColor }]}
                onPress={() => handleButtonPress(button)}
              >
                <Text style={styles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
    boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 3, color: "rgba(0,0,0,0.25)" }],
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontFamily: "Merriweather",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
