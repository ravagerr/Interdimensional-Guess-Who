import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "./theme";
import { Stack } from "expo-router";
import OfflineGuard from "./components/OfflineGuard";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <OfflineGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="CharacterDetail" />
            </Stack>
          </OfflineGuard>
        </SafeAreaProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
