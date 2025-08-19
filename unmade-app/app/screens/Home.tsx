import { View, Text, Pressable, ScrollView, Dimensions, ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Target, Book, Trophy, Info, Play, Users, Award, HelpCircle, Sparkles } from "lucide-react-native";
import { useTheme } from "../theme";
import ThemeToggle from "../components/ThemeToggle";

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const mainActions = [
    {
      title: "PLAY",
      subtitle: "Start Game",
      action: () => navigation.navigate("Play"),
      color: theme.colors.primary,
      backgroundColor: theme.colors.primaryBackground,
      icon: Play,
      isMainAction: true
    },
    {
      title: "EXPLORE",
      subtitle: "Characters",
      action: () => navigation.navigate("Dex"),
      color: theme.colors.success,
      backgroundColor: theme.colors.successBackground,
      icon: Users,
      isMainAction: false
    },
    {
      title: "SCORES",
      subtitle: "Leaderboard",
      action: () => navigation.navigate("Leaderboard"),
      color: theme.colors.secondary,
      backgroundColor: theme.colors.secondaryBackground,
      icon: Award,
      isMainAction: false
    },
    {
      title: "INFO",
      subtitle: "About Game",
      action: () => navigation.navigate("About"),
      color: theme.colors.accent,
      backgroundColor: theme.colors.accentBackground,
      icon: HelpCircle,
      isMainAction: false
    }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ paddingTop: insets.top + theme.spacing.lg }}>
        {/* Header */}
        <View style={{ alignItems: "center", paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xxl }}>
          <View style={{ alignItems: "center", marginBottom: theme.spacing.lg }}>
            <Sparkles size={40} color={theme.colors.primary} style={{ marginBottom: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxxxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text,
              letterSpacing: 1
            }}>
              GUESS WHO
            </Text>
            <Text style={{ 
              fontSize: theme.typography.sizes.lg, 
              fontWeight: theme.typography.weights.medium, 
              textAlign: "center",
              color: theme.colors.primary,
              marginTop: theme.spacing.xs,
              letterSpacing: 0.5
            }}>
              INTERDIMENSIONAL EDITION
            </Text>
          </View>
          
          <Text style={{ 
            fontSize: theme.typography.sizes.md, 
            textAlign: "center",
            color: theme.colors.textSecondary,
            lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
            marginBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.md
          }}>
            Test your Rick & Morty knowledge!
          </Text>
          
          {/* <ThemeToggle /> */}
        </View>

        {/* main play button */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          {mainActions.filter(action => action.isMainAction).map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Pressable
                key={index}
                onPress={action.action}
                style={({ pressed }) => ({
                  backgroundColor: action.color,
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.xl,
                  alignItems: "center",
                  opacity: pressed ? 0.9 : 1,
                  transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                  ...theme.shadows.lg,
                  borderWidth: 3,
                  borderColor: theme.colors.surface
                })}
              >
                <IconComponent size={48} color={theme.colors.surface} style={{ marginBottom: theme.spacing.sm }} />
                <Text style={{ 
                  fontSize: theme.typography.sizes.xxxl, 
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.surface,
                  letterSpacing: 1
                }}>
                  {action.title}
                </Text>
                <Text style={{ 
                  fontSize: theme.typography.sizes.md, 
                  color: theme.colors.surface,
                  opacity: 0.9,
                  marginTop: theme.spacing.xs
                }}>
                  {action.subtitle}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* secondary actions grid */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between",
            alignItems: "center",
            gap: theme.spacing.md
          }}>
            {mainActions.filter(action => !action.isMainAction).map((action, index) => {
              const IconComponent = action.icon;
              
              return (
                <Pressable
                  key={index}
                  onPress={action.action}
                  style={({ pressed }) => ({
                    backgroundColor: action.backgroundColor,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.lg,
                    alignItems: "center",
                    width: "30%",
                    opacity: pressed ? 0.8 : 1,
                    transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
                    ...theme.shadows.md,
                    borderWidth: 2,
                    borderColor: action.color,
                  })}
                >
                  <IconComponent size={28} color={action.color} style={{ marginBottom: theme.spacing.sm }} />
                  <Text style={{ 
                    fontSize: theme.typography.sizes.sm, 
                    fontWeight: theme.typography.weights.bold,
                    color: action.color,
                    textAlign: "center",
                    letterSpacing: 0.5
                  }}>
                    {action.title}
                  </Text>
                  <Text style={{ 
                    fontSize: theme.typography.sizes.xs, 
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    marginTop: theme.spacing.xs
                  }}>
                    {action.subtitle}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* quick rules */}
        <View style={{
          marginHorizontal: theme.spacing.lg,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.md }}>
            <Target size={20} color={theme.colors.primary} />
            <Text style={{ 
              fontSize: theme.typography.sizes.lg, 
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginLeft: theme.spacing.sm
            }}>
              Quick Rules
            </Text>
          </View>
          <View style={{ gap: theme.spacing.sm }}>
            <Text style={{ 
              fontSize: theme.typography.sizes.sm, 
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm
            }}>
              • Guess the character in 8 tries or less
            </Text>
            <Text style={{ 
              fontSize: theme.typography.sizes.sm, 
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm
            }}>
              • 🟢 Green = Perfect match, 🟡 Yellow = Partial match
            </Text>
            <Text style={{ 
              fontSize: theme.typography.sizes.sm, 
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm
            }}>
              • Get hints about species, status, origin & more!
            </Text>
          </View>
        </View>

        <View style={{ height: theme.spacing.xxl }} />
      </View>
    </ScrollView>
  );
}
