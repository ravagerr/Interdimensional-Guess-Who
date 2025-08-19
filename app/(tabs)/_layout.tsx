import { Tabs } from "expo-router";
import { Home as HomeIcon, Target, Book, Trophy, Info } from "lucide-react-native";
import { useTheme } from "../theme";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
          height: 90,
          ...theme.shadows.sm,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.xs,
          fontWeight: theme.typography.weights.medium,
          marginTop: 4
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: "Play",
          tabBarLabel: "Play",
          tabBarIcon: ({ color, size }) => (
            <Target size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="dex"
        options={{
          title: "CharacterDex",
          tabBarLabel: "Characters",
          tabBarIcon: ({ color, size }) => (
            <Book size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarLabel: "Scores",
          tabBarIcon: ({ color, size }) => (
            <Trophy size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => (
            <Info size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
