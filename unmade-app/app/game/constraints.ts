import type { CharacterLite } from "./compare";
import type { Hint } from "./compare";

export type Constraints = {
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
  origin?: string;
  location?: string;
  epsMin?: number;
  epsMax?: number;
};

const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();
const eq = (a?: string | null, b?: string | null) => norm(a) === norm(b);

export function getFieldValue(c: CharacterLite, field: keyof Constraints): string | undefined {
  switch (field) {
    case "status": return c.status ?? undefined;
    case "species": return c.species ?? undefined;
    case "type": return c.type ?? undefined;
    case "gender": return c.gender ?? undefined;
    case "origin": return c.origin?.name ?? undefined;
    case "location": return c.location?.name ?? undefined;
    default: return undefined;
  }
}

export function updateConstraints(prev: Constraints, hints: Hint[], guess: CharacterLite): Constraints {
  const next: Constraints = { ...prev };
  for (const h of hints) {
    if (h.field === "episodeCount") {
      const g = guess.episode?.length ?? 0;
      if (h.result === "higher") next.epsMin = Math.max(next.epsMin ?? 0, g + 1);
      if (h.result === "lower")  next.epsMax = Math.min(next.epsMax ?? Infinity, g - 1);
      if (h.result === "correct") { next.epsMin = g; next.epsMax = g; }
      continue;
    }
    if (h.result === "correct") {
      const v = getFieldValue(guess, h.field as keyof Constraints);
      if (v) (next as any)[h.field] = v;
    }
    if (h.field === "species" && h.result === "partial") {
      const v = guess.species; if (v) next.species = v;
    }
  }
  return next;
}

export function matches(c: CharacterLite, cs: Constraints): boolean {
  if (cs.status    && !eq(c.status, cs.status)) return false;
  if (cs.species   && !eq(c.species, cs.species)) return false;
  if (cs.type      && !eq(c.type, cs.type)) return false;
  if (cs.gender    && !eq(c.gender, cs.gender)) return false;
  if (cs.origin    && !eq(c.origin?.name, cs.origin)) return false;
  if (cs.location  && !eq(c.location?.name, cs.location)) return false;

  const n = c.episode?.length ?? 0;
  if (cs.epsMin !== undefined && n < cs.epsMin) return false;
  if (cs.epsMax !== undefined && n > cs.epsMax) return false;
  return true;
}

export function similarity(a: CharacterLite, b: CharacterLite): number {
  let s = 0;
  if (eq(a.status, b.status)) s++;
  if (eq(a.species, b.species)) s++;
  if (eq(a.type, b.type)) s++;
  if (eq(a.gender, b.gender)) s++;
  if (eq(a.origin?.name, b.origin?.name)) s++;
  if (eq(a.location?.name, b.location?.name)) s++;
  return s; // 0..6
}

export function similarityLabel(score: number): "Cold" | "Warm" | "Hot" {
  if (score >= 5) return "Hot";
  if (score >= 3) return "Warm";
  return "Cold";
}
