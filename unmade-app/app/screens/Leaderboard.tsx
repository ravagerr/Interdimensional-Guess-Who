import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, Pressable, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { listScores, clearScores, type Score } from "../lib/storage";
import EmptyState from "../components/EmptyState";
import { useTheme } from "../theme";

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const loadScores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listScores();
      // fewer guesses have priority
      const sortedData = data.sort((a, b) => {
        if (a.guesses !== b.guesses) {
          return a.guesses - b.guesses;
        }
        // if guesses are equal, sort by time (shorter is better)
        const timeA = a.timeMs || Infinity;
        const timeB = b.timeMs || Infinity;
        return timeA - timeB;
      });
      setScores(sortedData);
    } catch (error) {
      console.error("Failed to load scores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearScores = useCallback(async () => {
    if (Platform.OS === 'web') {
      // web alert for web lol
      const confirmed = confirm("Are you sure you want to clear all scores? This action cannot be undone.");
      if (confirmed) {
        try {
          await clearScores();
          setScores([]);
        } catch (error) {
          console.error("Failed to clear scores:", error);
          alert("Failed to clear scores. Please try again.");
        }
      }
    } else {
      // react native alert for mobile
      Alert.alert(
        "Clear Leaderboard",
        "Are you sure you want to clear all scores? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Clear All", 
            style: "destructive",
            onPress: async () => {
              try {
                await clearScores();
                setScores([]);
              } catch (error) {
                console.error("Failed to clear scores:", error);
                Alert.alert("Error", "Failed to clear scores. Please try again.");
              }
            }
          }
        ]
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadScores();
    }, [loadScores])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatTime = (ms?: number): string => {
    if (!ms) return "N/A";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    let formattedTime = "";
    if(minutes > 0) {
      formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')} minutes`;
    } else {
      formattedTime = `${remainingSeconds.toString().padStart(2, '0')} seconds`;
    }
    return formattedTime;
  };

  const getBadgeForGuesses = (guesses: number) => {
    if (guesses === 1) return { emoji: "🏆", title: "Perfect!" };
    if (guesses <= 3) return { emoji: "🥇", title: "Excellent" };
    if (guesses <= 5) return { emoji: "🥈", title: "Great" };
    if (guesses <= 7) return { emoji: "🥉", title: "Good" };
    return { emoji: "🎯", title: "Complete" };
  };

  const PodiumItem = ({ score, position }: { score: Score; position: 1 | 2 | 3 }) => {
    const podiumColors = {
      1: { bg: theme.colors.warning, text: theme.colors.surface, emoji: "🥇" },
      2: { bg: theme.colors.textSecondary, text: theme.colors.surface, emoji: "🥈" },
      3: { bg: "#CD7F32", text: theme.colors.surface, emoji: "🥉" }
    };
    
    const colors = podiumColors[position];
    const heights = { 1: 120, 2: 100, 3: 80 };
    
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 32, marginBottom: theme.spacing.sm }}>{colors.emoji}</Text>
        <View style={{
          backgroundColor: colors.bg,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          minHeight: heights[position],
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          ...theme.shadows.md
        }}>
          <Text style={{
            color: colors.text,
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.bold,
            textAlign: "center",
            marginBottom: theme.spacing.xs
          }}>
            {score.guesses} guess{score.guesses !== 1 ? "es" : ""}
          </Text>
          <Text style={{
            color: colors.text,
            fontSize: theme.typography.sizes.xs,
            textAlign: "center"
          }}>
            in {formatTime(score.timeMs)}
          </Text>
        </View>
      </View>
    );
  };

  const renderScore = ({ item, index }: { item: Score; index: number }) => {
    const badge = getBadgeForGuesses(item.guesses);
    
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing.lg,
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.xs,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.textSecondary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: theme.spacing.md
        }}>
          <Text style={{
            color: theme.colors.surface,
            fontWeight: theme.typography.weights.bold,
            fontSize: theme.typography.sizes.md
          }}>
            #{index + 4}
          </Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.xs }}>
            <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>{badge.emoji}</Text>
            <Text style={{ 
              fontSize: theme.typography.sizes.md, 
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text
            }}>
              {item.guesses} guess{item.guesses !== 1 ? "es" : ""}
            </Text>
            <Text style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary,
              marginLeft: theme.spacing.md
            }}>
              {formatTime(item.timeMs)}
            </Text>
          </View>
          
          <Text style={{ 
            fontSize: theme.typography.sizes.sm, 
            color: theme.colors.textSecondary
          }}>
            {formatDate(item.when)}
          </Text>
        </View>
      </View>
    );
  };

  const topThree = scores.slice(0, 3);
  const remaining = scores.slice(3);

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.xl, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.md }}>
          <Text style={{ 
            fontSize: theme.typography.sizes.xl, 
            fontWeight: theme.typography.weights.bold, 
            color: theme.colors.text
          }}>
            Leaderboard
          </Text>
          {scores.length > 0 && (
            <Pressable
              onPress={handleClearScores}
              style={({ pressed }) => ({
                backgroundColor: theme.colors.errorBackground,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                opacity: pressed ? 0.5 : 1
              })}
            >
              <Text style={{
                color: theme.colors.error,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.semibold
              }}>
                Clear All
              </Text>
            </Pressable>
          )}
        </View>
        <Text style={{ 
          fontSize: theme.typography.sizes.sm, 
          color: theme.colors.textSecondary
        }}>
          Your best performances ranked by fewest guesses and fastest time
        </Text>
      </View>

      <FlatList
        data={remaining}
        keyExtractor={(item, index) => `${item.when}-${index}`}
        renderItem={renderScore}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadScores} 
          />
        }
        ListHeaderComponent={() => (
          <View>
            {topThree.length > 0 && (
              <View style={{ padding: theme.spacing.xl }}>
                <Text style={{ 
                  fontSize: theme.typography.sizes.lg, 
                  fontWeight: theme.typography.weights.bold, 
                  color: theme.colors.text,
                  textAlign: "center",
                  marginBottom: theme.spacing.lg
                }}>
                  Top Performers
                </Text>
                
                <View style={{ 
                  flexDirection: "row", 
                  alignItems: "flex-end", 
                  justifyContent: "center",
                  gap: theme.spacing.sm,
                  marginBottom: theme.spacing.xl
                }}>
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <PodiumItem score={topThree[1]} position={2} />
                  )}
                  
                  {/* 1st Place */}
                  {topThree[0] && (
                    <PodiumItem score={topThree[0]} position={1} />
                  )}
                  
                  {/* 3rd Place */}
                  {topThree[2] && (
                    <PodiumItem score={topThree[2]} position={3} />
                  )}
                </View>
              </View>
            )}
            
            {remaining.length > 0 && (
              <Text style={{ 
                fontSize: theme.typography.sizes.md, 
                fontWeight: theme.typography.weights.semibold, 
                color: theme.colors.text,
                marginHorizontal: theme.spacing.lg,
                marginBottom: theme.spacing.md
              }}>
                Other Scores
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ paddingTop: 60 }}>
            <EmptyState 
              title="No scores yet"
              message="Play some games to see your scores here!"
              icon="🏆"
            />
          </View>
        )}
        contentContainerStyle={{ 
          paddingVertical: theme.spacing.md,
          flexGrow: 1
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
