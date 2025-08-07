import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const [data, setData] = useState<{ string1: String; string2: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://192.168.0.44:5000/characters")
      .then((res) => res.json())
      .then((json) => setData(json))
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
