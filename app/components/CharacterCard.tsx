import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Info } from "lucide-react-native";
import { useTheme } from "../theme";

export default function CharacterCard({ 
  item, 
  onPress, 
  onInfo 
}: { 
  item: any; 
  onPress?: () => void; 
  onInfo?: () => void; 
}) {
  const { theme } = useTheme();
  
  return (
    <View
     style={{ 
      flexDirection: "row", 
      gap: theme.spacing.md, 
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "center",
      backgroundColor: theme.colors.surface
    }}>
        <Image 
          source={{ uri: item.image }} 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: theme.borderRadius.md,
            borderWidth: 2,
            borderColor: theme.colors.border
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />

      <Pressable 
        onPress={onPress || onInfo} 
        style={({ pressed }) => ({ 
          flex: 1,
          opacity: pressed ? 0.7 : 1
        })}
      >
        <Text style={{ 
          fontWeight: theme.typography.weights.semibold, 
          fontSize: theme.typography.sizes.md, 
          marginBottom: 2,
          color: theme.colors.text
        }}>
          {item.name}
        </Text>
        <Text style={{ 
          color: theme.colors.textSecondary, 
          fontSize: theme.typography.sizes.sm
        }}>
          {item.species}{item.status ? ` • ${item.status}` : ""}{item.type ? ` • ${item.type}` : ""}
        </Text>
        {item.origin?.name && (
          <Text style={{ 
            color: theme.colors.textMuted, 
            fontSize: theme.typography.sizes.xs, 
            marginTop: 2
          }}>
            From: {item.origin.name}
          </Text>
        )}
      </Pressable>

      {onInfo && (
        <Pressable 
          onPress={onInfo} 
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.sm,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: pressed ? theme.colors.surfaceSecondary : theme.colors.surface,
            opacity: pressed ? 0.8 : 1,
            flexDirection: "row",
            alignItems: "center",
            ...theme.shadows.sm
          })}
        >
          <Info size={14} color={theme.colors.textSecondary} />
          <Text style={{ 
            fontSize: theme.typography.sizes.xs, 
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.textSecondary,
            marginLeft: theme.spacing.xs
          }}>
            Info
          </Text>
        </Pressable>
      )}
    </View>
  );
}
