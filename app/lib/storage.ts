import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "rnm-scores";

export type Score = { guesses: number; mode: "normal" | "hard"; when: string; timeMs?: number };

export async function saveScore(s: Score) {
  const raw = (await AsyncStorage.getItem(KEY)) ?? "[]";
  const arr = JSON.parse(raw) as Score[];
  arr.unshift(s);
  await AsyncStorage.setItem(KEY, JSON.stringify(arr.slice(0, 50)));
}

export async function listScores(): Promise<Score[]> {
  const raw = (await AsyncStorage.getItem(KEY)) ?? "[]";
  return JSON.parse(raw);
}

export async function clearScores(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
