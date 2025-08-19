import { View, Text } from "react-native";
import type { Hint } from "../game/compare";
import type { CharacterLite } from "../game/compare";
import { useTheme } from "../theme";

export default function HintChips({ hints, character }: { hints: Hint[]; character: CharacterLite }) {
  const { theme } = useTheme();
  const getChipStyle = (result: string) => {
    switch (result) {
      case "correct":
        return { backgroundColor: theme.colors.successBackground, borderColor: theme.colors.success };
      case "partial":
        return { backgroundColor: theme.colors.warningBackground, borderColor: theme.colors.warning };
      case "higher":
      case "lower":
        return { backgroundColor: theme.colors.errorBackground, borderColor: theme.colors.error };
      default:
        return { backgroundColor: theme.colors.surfaceSecondary, borderColor: theme.colors.border };
    }
  };

  const getFieldValue = (field: string) => {
    switch (field) {
      case "status": return character.status || "Unknown";
      case "species": return character.species || "Unknown";
      case "type": return character.type || "Unknown";
      case "gender": return character.gender || "Unknown";
      case "origin": return character.origin?.name || "Unknown";
      case "location": return character.location?.name || "Unknown";
      case "episodeCount": return character.episode?.length || 0;
      default: return "Unknown";
    }
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
      {hints.map(h => (
        <View key={h.field} style={{
          borderWidth: 1, 
          borderRadius: theme.borderRadius.full, 
          paddingHorizontal: theme.spacing.md, 
          paddingVertical: theme.spacing.xs,
          ...getChipStyle(h.result),
          ...theme.shadows.sm
        }}>
          <Text style={{ 
            fontSize: theme.typography.sizes.xs, 
            fontWeight: theme.typography.weights.medium,
            color: h.result === "correct" ? theme.colors.success :
                   h.result === "partial" ? theme.colors.warning :
                   (h.result === "higher" || h.result === "lower") ? theme.colors.error :
                   theme.colors.textSecondary
          }}>
            {h.field}: {getFieldValue(h.field)}{h.field === "episodeCount" && h.result !== "correct" ? ` (${h.result})` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}
