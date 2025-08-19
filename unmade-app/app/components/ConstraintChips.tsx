import { View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native";
import type { Constraints } from "../game/constraints";
import { useTheme } from "../theme";

export default function ConstraintChips({
  cs,
  onClearKey,
}: {
  cs: Constraints;
  onClearKey: (key: keyof Constraints) => void;
}) {
  const { theme } = useTheme();
  const items = [
    ["status", cs.status],
    ["species", cs.species],
    ["type", cs.type],
    ["gender", cs.gender],
    ["origin", cs.origin],
    ["location", cs.location],
    ["episodes", cs.epsMin === cs.epsMax && cs.epsMin !== undefined ? `${cs.epsMin}` :
      cs.epsMin !== undefined || cs.epsMax !== undefined
        ? `${cs.epsMin ?? 0}–${cs.epsMax ?? "∞"}`
        : undefined],
  ] as const;

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
      {items.filter(([,v]) => v !== undefined).map(([k,v]) => (
        <Pressable 
          key={String(k)} 
          onPress={() => onClearKey(k === "episodes" ? "epsMin" : k as any)} 
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1, 
            borderRadius: theme.borderRadius.full, 
            paddingHorizontal: theme.spacing.md, 
            paddingVertical: theme.spacing.xs,
            backgroundColor: pressed ? theme.colors.accentBackground : theme.colors.accent + '20',
            borderColor: theme.colors.accent,
            opacity: pressed ? 0.8 : 1,
            ...theme.shadows.sm
          })}
        >
          <Text style={{ 
            color: theme.colors.accent, 
            fontSize: theme.typography.sizes.xs, 
            fontWeight: theme.typography.weights.medium,
            marginRight: theme.spacing.xs
          }}>
            {k}: {v}
          </Text>
          <X size={12} color={theme.colors.accent} />
        </Pressable>
      ))}
    </View>
  );
}
