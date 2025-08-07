import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import CharactersScreen from "./screens/CharactersScreen";
import QRScannerScreen from "./screens/QRScannerScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("serverUrl").then((url) => {
      setInitialRoute(url ? "CharactersScreen" : "QRScannerScreen");
    });
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="CharactersScreen" component={CharactersScreen} />
      <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
    </Stack.Navigator>
  );
}
