import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { fetchCharacters } from "../api/chim-manager";

export default function CharactersScreen() {
  const [data, setData] = useState<{ string1: string; string2: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters()
      .then(setData)
      .catch((err) => setData({ string1: "Error", string2: err.message }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator />
      ) : data ? (
        <>
          <Text>{data.string1}</Text>
          <Text>{data.string2}</Text>
        </>
      ) : (
        <Text>No data</Text>
      )}
    </View>
  );
}
