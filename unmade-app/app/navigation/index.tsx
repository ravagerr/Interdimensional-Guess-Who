import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home as HomeIcon, Target, Book, Trophy, Info } from "lucide-react-native";
import { useTheme } from "../theme";
import Home from "../screens/Home";
import Play from "../screens/Play";
import CharacterDex from "../screens/CharacterDex";
import Leaderboard from "../screens/Leaderboard";
import About from "../screens/About";
import CharacterDetail from "../screens/CharacterDetail";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator 
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
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Play" 
        component={Play}
        options={{
          tabBarLabel: "Play",
          tabBarIcon: ({ color, size }) => (
            <Target size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Dex" 
        component={CharacterDex} 
        options={{ 
          title: "CharacterDex",
          tabBarLabel: "Characters",
          tabBarIcon: ({ color, size }) => (
            <Book size={size} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={Leaderboard}
        options={{
          tabBarLabel: "Scores",
          tabBarIcon: ({ color, size }) => (
            <Trophy size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="About" 
        component={About}
        options={{
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => (
            <Info size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CharacterDetail" component={CharacterDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
