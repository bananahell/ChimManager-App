export interface CharactersResponse {
  string1: string;
  string2: string;
}

export async function fetchCharacters() {
  const res = await fetch("http://192.168.0.44:5000/characters");
  if (!res.ok) {
    throw new Error("Failed to fetch characters");
  }
  return res.json();
}
