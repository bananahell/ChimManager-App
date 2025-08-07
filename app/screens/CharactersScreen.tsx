import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { CharactersResponse, fetchCharacters } from "../api/chim-manager";

export default function CharactersScreen({ navigation }: any) {
  const [data, setData] = useState<CharactersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
        <Button
          title="Scan QR Again"
          onPress={() => navigation.replace("QRScannerScreen")}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{data?.string1}</Text>
      <Text>{data?.string2}</Text>
      <Button
        title="Scan QR Again"
        onPress={() => navigation.replace("QRScannerScreen")}
      />
    </View>
  );
}
