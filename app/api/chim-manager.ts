import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CharactersResponse {
  string1: string;
  string2: string;
}

export async function fetchCharacters(): Promise<CharactersResponse> {
  const serverUrl = await AsyncStorage.getItem("serverUrl");
  if (!serverUrl) {
    throw new Error("Server URL not set. Please scan the QR code.");
  }
  const res = await fetch(`http://${serverUrl}:5000/characters`);
  if (!res.ok) {
    throw new Error("Failed to fetch characters");
  }
  return res.json();
}
