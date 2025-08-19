import { useState, useCallback } from "react";
import { View, TextInput, FlatList, RefreshControl, Text } from "react-native";
import { useQuery } from "@apollo/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CHARACTERS } from "../graphql/queries";
import CharacterCard from "../components/CharacterCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useTheme } from "../theme";
import OfflineGuard from "../components/OfflineGuard";

export default function CharacterDex() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [q, setQ] = useState("");
  const insets = useSafeAreaInsets();
  
  const { data, fetchMore, refetch, loading, error } = useQuery(CHARACTERS, {
    variables: { page: 1, filter: { name: q } },
    notifyOnNetworkStatusChange: true,
  });

  const results = data?.characters?.results ?? [];
  const next = data?.characters?.info?.next;

  const handleEndReached = useCallback(() => {
    if (next && !loading) {
      fetchMore({ 
        variables: { page: next, filter: { name: q } } 
      });
    }
  }, [next, loading, fetchMore, q]);

  const handleSearch = useCallback((text: string) => {
    setQ(text);
    refetch({ page: 1, filter: { name: text } });
  }, [refetch]);

  if (error) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <EmptyState 
          title="Oops! Something went wrong"
          message="We couldn't load the characters. Check your connection and try again."
          icon="💥"
        />
      </View>
    );
  }

  return (
    <OfflineGuard 
      title="Character Database Requires Internet" 
      message="The character database needs an internet connection to load Rick and Morty character data. Please connect to the internet to browse characters!"
      showRetry={true}
      onRetry={() => refetch()}
    >
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.xl, paddingBottom: theme.spacing.sm }}>
        <Text style={{ 
          fontSize: theme.typography.sizes.xl, 
          fontWeight: theme.typography.weights.bold, 
          marginBottom: theme.spacing.xl,
          color: theme.colors.text
        }}>
          Character Database
        </Text>
        
        <TextInput
          placeholder="Search characters by name..."
          value={q}
          onChangeText={handleSearch}
          style={{ 
            borderWidth: 1, 
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.lg, 
            padding: theme.spacing.md, 
            marginBottom: theme.spacing.xl,
            fontSize: theme.typography.sizes.md,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text
          }}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl 
            refreshing={loading && !results.length} 
            onRefresh={() => refetch()} 
          />
        }
        renderItem={({ item }) => (
          <CharacterCard 
            item={item} 
            onInfo={() => navigation.navigate("CharacterDetail", { id: item.id })}
          />
        )}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={{ padding: theme.spacing.xl }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </View>
            );
          }
          return (
            <EmptyState 
              title="No characters found"
              message={q ? `No characters match "${q}". Try a different search term.` : "Start searching to discover characters!"}
              icon="🔍"
            />
          );
        }}
        ListFooterComponent={() => (
          loading && results.length > 0 ? (
            <View style={{ padding: theme.spacing.xl }}>
              <LoadingSkeleton />
            </View>
          ) : null
        )}
      />
      </View>
    </OfflineGuard>
  );
}
