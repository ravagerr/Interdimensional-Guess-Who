import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Wrench, Sparkles, Heart, Target, ExternalLink, Info } from "lucide-react-native";
import { useTheme } from "../theme";
import ThemeToggle from "../components/ThemeToggle";

export default function About() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ paddingTop: insets.top + theme.spacing.xl, padding: theme.spacing.xl }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: theme.spacing.xxxxl }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.md }}>
            <Info size={32} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text
            }}>
              About This Game
            </Text>
          </View>
          <Text style={{ 
            fontSize: theme.typography.sizes.md, 
            textAlign: "center",
            color: theme.colors.textSecondary,
            lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
          }}>
            An interdimensional guessing game built with React Native
          </Text>
          
          {/* <ThemeToggle /> */}
        </View>

        {/* Tech Stack */}
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.xxl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.md
        }}>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Wrench size={32} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text
            }}>
              Tech Stack
            </Text>
          </View>
          <Text style={{ 
            fontSize: theme.typography.sizes.lg, 
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
          }}>
            </Text>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• React Native with Expo</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• TypeScript for type safety</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Apollo Client for GraphQL</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• React Navigation for screens</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• AsyncStorage for leaderboard</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Rick and Morty API</Text>
          </View>
        </View>

        {/* Features */}
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.xxl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.md
        }}>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Sparkles size={32} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text
            }}>
             Features
            </Text>
          </View>
          <Text style={{ 
            fontSize: theme.typography.sizes.lg, 
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
          }}>
            </Text>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Character guessing game with hints</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Complete character database with search</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Local leaderboard and scoring</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Infinite scroll and caching</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Responsive UI with loading states</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Offline detection</Text>
          </View>
        </View>

        {/* API Credit */}
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.xxl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.md
        }}>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Heart size={32} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text
            }}>
              Credits
            </Text>
          </View>
          <Text style={{ 
            fontSize: theme.typography.sizes.lg, 
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
          }}>
            </Text>
          <Text style={{ 
            fontSize: theme.typography.sizes.sm, 
            color: theme.colors.textSecondary,
            lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
            marginBottom: theme.spacing.md
          }}>
            This game uses the Rick and Morty API to fetch character data. 
            All character information and images are provided by the API.
          </Text>
          <Pressable
            onPress={() => openLink("https://rickandmortyapi.com/")}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              alignSelf: "flex-start"
            }}
          >
            <Text style={{
              color: theme.colors.surface,
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.semibold
            }}>
              Visit Rick and Morty API →
            </Text>
          </Pressable>
        </View>

        {/* Game Logic */}
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.xxl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.md
        }}>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Target size={32} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text
            }}>
              Game Logic
            </Text>
          </View>
          <Text style={{ 
            fontSize: theme.typography.sizes.lg, 
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
          }}>
            </Text>
          <Text style={{ 
            fontSize: theme.typography.sizes.sm, 
            color: theme.colors.textSecondary,
            lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
            marginBottom: theme.spacing.md
          }}>
            The game compares your guesses against a randomly selected target character across multiple attributes:
          </Text>
          <View style={{ gap: 6, marginLeft: 12 }}>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Status (Alive/Dead/Unknown)</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Species (Human/Alien/etc.)</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Type (subspecies info)</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Gender</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Origin location</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Current location</Text>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>• Episode count (with higher/lower hints)</Text>
          </View>
        </View>

        {/* Version */}
        <View style={{
          alignItems: "center",
          paddingVertical: theme.spacing.xxl
        }}>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Info size={32} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              textAlign: "center",
              color: theme.colors.text
            }}>
              Version
            </Text>
          </View>
          <Text style={{ 
            fontSize: theme.typography.sizes.sm, 
            color: theme.colors.textSecondary,
            textAlign: "center"
          }}>
            v1.0.0{"\n"}
            Built for the Rick and Morty universe fans
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
