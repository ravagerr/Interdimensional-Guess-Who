import { View, Text } from "react-native";
import { Search, Dice6, HelpCircle } from "lucide-react-native";
import { useTheme } from "../theme";

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: string;
};

const getIconComponent = (icon: string, color: string) => { // should probably find a better way to do this
  switch (icon) {
    case "🔍":
      return <Search size={48} color={color} />;
    case "🎲":
      return <Dice6 size={48} color={color} />;
    default:
      return <HelpCircle size={48} color={color} />;
  }
};

export default function EmptyState({ title, message, icon = "🤷‍♂️" }: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      padding: theme.spacing.xxxl 
    }}>
      <View style={{ marginBottom: theme.spacing.lg }}>
        {getIconComponent(icon, theme.colors.textMuted)}
      </View>
      <Text style={{ 
        fontSize: theme.typography.sizes.lg, 
        fontWeight: theme.typography.weights.semibold, 
        textAlign: "center", 
        marginBottom: theme.spacing.sm,
        color: theme.colors.text
      }}>
        {title}
      </Text>
      <Text style={{ 
        fontSize: theme.typography.sizes.sm, 
        textAlign: "center", 
        color: theme.colors.textSecondary,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm
      }}>
        {message}
      </Text>
    </View>
  );
}
