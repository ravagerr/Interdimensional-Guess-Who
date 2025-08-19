import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo";
import RootNav from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "./theme";

export default function App() {
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <RootNav />
        </SafeAreaProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
