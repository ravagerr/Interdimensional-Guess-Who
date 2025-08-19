export type CharacterLite = {
  id: string; name: string;
  status?: string | null;
  species?: string | null;
  type?: string | null;
  gender?: string | null;
  origin?: { name?: string | null } | null;
  location?: { name?: string | null } | null;
  episode?: { id: string }[];
};

export type HintResult = "correct" | "incorrect" | "higher" | "lower" | "partial";
export type HintField = "status" | "species" | "type" | "gender" | "origin" | "location" | "episodeCount";

export type Hint = { field: HintField; result: HintResult };

const eq = (a?: string | null, b?: string | null) =>
  (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

export const compareGuess = (target: CharacterLite, guess: CharacterLite): Hint[] => {
  const tEps = target.episode?.length ?? 0;
  const gEps = guess.episode?.length ?? 0;
  return [
    { field: "status",   result: eq(target.status,   guess.status)   ? "correct" : "incorrect" },
    { field: "species",  result: eq(target.species,  guess.species)  ? "correct" : "partial"  }, // partial used if species matches but type differs
    { field: "type",     result: eq(target.type,     guess.type)     ? "correct" : "incorrect" },
    { field: "gender",   result: eq(target.gender,   guess.gender)   ? "correct" : "incorrect" },
    { field: "origin",   result: eq(target.origin?.name,   guess.origin?.name)   ? "correct" : "incorrect" },
    { field: "location", result: eq(target.location?.name, guess.location?.name) ? "correct" : "incorrect" },
    { field: "episodeCount", result: tEps === gEps ? "correct" : (tEps > gEps ? "higher" : "lower") },
  ];
};
