import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, TextInput, FlatList, Pressable, Modal, ScrollView, Alert, Platform } from "react-native";
import { Image } from "expo-image";
import { useApolloClient } from "@apollo/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Search, Lightbulb, Trophy, RefreshCw, Target, Thermometer, Filter } from "lucide-react-native";
import { useTheme } from "../theme";
import { useAllCharacters } from "../hooks/useAllCharacters";
import { compareGuess } from "../game/compare";
import { matches, similarity, similarityLabel, type Constraints } from "../game/constraints";
import HintChips from "../components/HintChips";
import ConstraintChips from "../components/ConstraintChips";
import FilterModal from "../components/FilterModal";
import { saveScore } from "../lib/storage";
import CharacterCard from "../components/CharacterCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { pickRandomCharacter } from "../game/random";
import OfflineGuard from "../components/OfflineGuard";

const MAX_GUESSES = 8;

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function Play() {
  const { theme } = useTheme();
  const client = useApolloClient();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [target, setTarget] = useState<any | null>(null);
  const [q, setQ] = useState("");
  const [guesses, setGuesses] = useState<{ c: any; hints: any[]; sim: number }[]>([]);
  const [win, setWin] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [constraints, setConstraints] = useState<Constraints>({});
  const [tokens, setTokens] = useState(2);
  const [candidates, setCandidates] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState(0); // used for win modal display
  const gameTimeRef = useRef(0); // real time tracking without re-renders
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { characters: allCharacters, loading: charactersLoading, totalCount } = useAllCharacters();
  const initialiseGame = useCallback(async () => {
    try {
      setLoading(true);
      const randomCharacter = await pickRandomCharacter(client);
      setTarget(randomCharacter);
      setGuesses([]);
      setWin(false);
      setGameOver(false);
      setQ("");
      setTokens(2);
      setConstraints({});
      setStartTime(Date.now());
      setGameTime(0);
    } catch (error) {
      Alert.alert("Error", "Failed to load a character. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    initialiseGame();
  }, [initialiseGame]);

  // timer - tracks just in ref cause i cant figure out how to do it without re-renders
  useEffect(() => {
    if (startTime && !gameOver) {
      timerRef.current = setInterval(() => {
        gameTimeRef.current = Date.now() - startTime;
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTime, gameOver]);

  // compute filtered list and candidates count
  const searchFiltered = allCharacters.filter((c: any) => 
    q.trim() === '' || c.name.toLowerCase().includes(q.toLowerCase())
  );
  const constraintFiltered = searchFiltered.filter((c: any) => matches(c, constraints));
  const availableCharacters = constraintFiltered;
  
  useEffect(() => setCandidates(constraintFiltered.length), [constraintFiltered]);

  // compute available values for filter options from all loaded characters
  const availableValues = {
    statuses: [...new Set(allCharacters.map((c: any) => c.status).filter(Boolean))] as string[],
    species: [...new Set(allCharacters.map((c: any) => c.species).filter(Boolean))] as string[],
    types: [...new Set(allCharacters.map((c: any) => c.type).filter(Boolean))] as string[],
    genders: [...new Set(allCharacters.map((c: any) => c.gender).filter(Boolean))] as string[],
    origins: [...new Set(allCharacters.map((c: any) => c.origin?.name).filter(Boolean))] as string[],
    locations: [...new Set(allCharacters.map((c: any) => c.location?.name).filter(Boolean))] as string[],
    maxEpisodes: Math.max(...allCharacters.map((c: any) => c.episode?.length ?? 0), 10)
      };

    const onGuess = async (c: any) => {
    if (!target || gameOver) return;
    
    // check if already guessed works on mobile cant be asked to make web
    if (guesses.some(g => g.c.id === c.id)) {
      Alert.alert("Already Guessed", "You've already guessed this character!");
      return;
    }

    const hints = compareGuess(target, c);
    const sim = similarity(target, c);
    const newGuesses = [{ c, hints, sim }, ...guesses];
    setGuesses(newGuesses);
    
    // winning condition if target id matches guess id
    const isCorrectCharacter = target.id === c.id;
    
    if (isCorrectCharacter) {
      setWin(true);
      setGameOver(true);

      const finalTime = gameTimeRef.current;
      await saveScore({ 
        guesses: newGuesses.length, 
        mode: "normal", 
        when: new Date().toISOString(),
        timeMs: finalTime
      });

      setGameTime(finalTime);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
    }
    
    setQ(""); // clear search after guess, kinda optional tbh
  };

  const handleSearch = useCallback((text: string) => {
    setQ(text);
  }, []);

  // main loading screen when navigating to the page
  if (loading || charactersLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        paddingTop: insets.top,
        backgroundColor: theme.colors.background 
      }}>
        <RefreshCw 
          size={48} 
          color={theme.colors.primary} 
          style={{ marginBottom: theme.spacing.lg }} 
        />
        <Text style={{ 
          fontSize: theme.typography.sizes.lg, 
          marginBottom: theme.spacing.lg,
          color: theme.colors.text,
          fontWeight: theme.typography.weights.medium
        }}>{'Loading new game...'}</Text>
      </View>
    );
  }

  // main screen
  return (
    <OfflineGuard 
      title="Game Requires Internet" 
      message="The Rick and Morty guessing game needs an internet connection to load character data. Please connect to the internet to start playing!"
      showRetry={true}
      onRetry={initialiseGame}
    >
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.md }}>
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: theme.spacing.md 
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Target size={28} color={theme.colors.primary} />
            <Text style={{ 
              fontSize: theme.typography.sizes.xxl, 
              fontWeight: theme.typography.weights.bold, 
              marginLeft: theme.spacing.sm,
              color: theme.colors.text,
              flex: 1
            }}>
              Interdimensional Guess Who
            </Text>
          </View>
        </View>
        
        <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ 
              backgroundColor: theme.colors.surfaceSecondary,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              flexDirection: "row",
              alignItems: "center"
            }}>
              <Text style={{ 
                color: theme.colors.textSecondary, 
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium
              }}>
                {guesses.length}/{MAX_GUESSES} • {candidates}/{totalCount || 826} left • {tokens} hints
              </Text>
            </View>
            <View style={{
              backgroundColor: gameOver 
                ? (win ? theme.colors.successBackground : theme.colors.errorBackground)
                : theme.colors.primaryBackground,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
              flexDirection: "row",
              alignItems: "center"
            }}>
              {gameOver ? (
                win ? (
                  <Trophy size={16} color={theme.colors.success} style={{ marginRight: theme.spacing.xs }} />
                ) : (
                  <Target size={16} color={theme.colors.error} style={{ marginRight: theme.spacing.xs }} />
                )
              ) : (
                <Target size={16} color={theme.colors.primary} style={{ marginRight: theme.spacing.xs }} />
              )}
              <Text style={{ 
                color: gameOver 
                  ? (win ? theme.colors.success : theme.colors.error)
                  : theme.colors.primary,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.semibold
              }}>
                {gameOver ? (win ? "Won!" : "Game Over") : "Playing"}
              </Text>
            </View>
          </View>
          
          <Pressable 
            onPress={() => setFilterModalVisible(true)}
            style={({ pressed }) => {
              const hasActiveFilters = Object.values(constraints).some(value => value !== undefined);
              return {
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1, 
                borderRadius: theme.borderRadius.md, 
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                backgroundColor: pressed 
                  ? theme.colors.primaryBackground 
                  : hasActiveFilters 
                    ? theme.colors.primary + '40'
                    : theme.colors.primary + '20',
                borderColor: theme.colors.primary,
                ...theme.shadows.sm
              };
            }}
          >
            <Filter size={16} color={theme.colors.primary} />
            <Text style={{ 
              fontSize: theme.typography.sizes.sm, 
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.primary,
              marginLeft: theme.spacing.xs
            }}>
              {/* check if filters are applied and show different text to differentiate */}
              {Object.values(constraints).some(value => value !== undefined) 
                ? `Filters Active` 
                : `Filter Available`}
            </Text>
          </Pressable>
        </View>

        {!gameOver && (
          <>
            {/* active filter chips */}
            {Object.values(constraints).some(value => value !== undefined) && (
              <View style={{ marginBottom: theme.spacing.md }}>
                <ConstraintChips
                  cs={constraints}
                  onClearKey={(k) => setConstraints(cs => ({ 
                    ...cs, 
                    [k]: undefined, 
                    ...(k === "epsMin" ? { epsMin: undefined, epsMax: undefined } : {}) 
                  }))}
                />
              </View>
            )}
            
            <View style={{
              position: "relative",
              marginBottom: theme.spacing.md
            }}>
              <Search 
                size={20} 
                color={theme.colors.textMuted} 
                style={{
                  position: "absolute",
                  left: theme.spacing.md,
                  top: theme.spacing.md,
                  zIndex: 1
                }}
              />
              <TextInput
                placeholder="Search & tap to guess..."
                placeholderTextColor={theme.colors.textMuted}
                value={q}
                onChangeText={handleSearch}
                style={{ 
                  borderWidth: 1, 
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md, 
                  paddingLeft: 48,
                  paddingRight: theme.spacing.lg,
                  paddingVertical: theme.spacing.md,
                  fontSize: theme.typography.sizes.md,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  ...theme.shadows.sm
                }}
              />
            </View>
            
            {/* hint tokens */}
            <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
              <Pressable 
                disabled={tokens === 0 || !target} 
                onPress={() => {
                  if (!target || tokens === 0) return;
                  setTokens(t => t - 1);
                  setConstraints(cs => ({ ...cs, origin: target.origin?.name ?? cs.origin }));
                }} 
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1, 
                  borderRadius: theme.borderRadius.md, 
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  backgroundColor: tokens === 0 
                    ? theme.colors.surfaceSecondary 
                    : pressed 
                      ? theme.colors.secondaryBackground 
                      : theme.colors.secondary + '20',
                  borderColor: tokens === 0 ? theme.colors.border : theme.colors.secondary,
                  opacity: tokens === 0 ? 0.5 : 1,
                  ...theme.shadows.sm
                })}
              >
                <Lightbulb size={16} color={tokens === 0 ? theme.colors.textMuted : theme.colors.secondary} />
                <Text style={{ 
                  fontSize: theme.typography.sizes.sm, 
                  fontWeight: theme.typography.weights.medium,
                  color: tokens === 0 ? theme.colors.textMuted : theme.colors.secondary,
                  marginLeft: theme.spacing.xs
                }}>
                  Reveal Origin
                </Text>
              </Pressable>

              <Pressable 
                disabled={tokens === 0 || !target} 
                onPress={() => {
                  if (!target || tokens === 0) return;
                  setTokens(t => t - 1);
                  setConstraints(cs => ({ ...cs, type: target.type ?? cs.type }));
                }} 
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1, 
                  borderRadius: theme.borderRadius.md, 
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  backgroundColor: tokens === 0 
                    ? theme.colors.surfaceSecondary 
                    : pressed 
                      ? theme.colors.secondaryBackground 
                      : theme.colors.secondary + '20',
                  borderColor: tokens === 0 ? theme.colors.border : theme.colors.secondary,
                  opacity: tokens === 0 ? 0.5 : 1,
                  ...theme.shadows.sm
                })}
              >
                <Lightbulb size={16} color={tokens === 0 ? theme.colors.textMuted : theme.colors.secondary} />
                <Text style={{ 
                  fontSize: theme.typography.sizes.sm, 
                  fontWeight: theme.typography.weights.medium,
                  color: tokens === 0 ? theme.colors.textMuted : theme.colors.secondary,
                  marginLeft: theme.spacing.xs
                }}>
                  Reveal Type
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>

      <View style={{ flex: 1, padding: theme.spacing.md }}>
        {!gameOver && (
          <View style={{ 
            maxHeight: 200, 
            borderWidth: 1, 
            borderColor: theme.colors.border, 
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface,
            ...theme.shadows.sm 
          }}>
            <FlatList
              data={availableCharacters}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CharacterCard 
                  item={item} 
                  onPress={() => onGuess(item)} 
                  onInfo={() => navigation.navigate("CharacterDetail", { id: item.id })}
                />
              )}
              ListEmptyComponent={() => {
                if (charactersLoading) {
                  return <LoadingSkeleton />;
                }
                
                // check if we have active filters
                const hasActiveFilters = Object.values(constraints).some(value => value !== undefined);
                const hasSearchQuery = q.trim();
                
                if (hasActiveFilters && !hasSearchQuery) {
                  // return empty state due to filters
                  return (
                    <EmptyState 
                      title="No characters match your filters"
                      message="Try adjusting your filters or clear some to see more characters"
                      icon="🎯"
                    />
                  );
                } else if (hasSearchQuery && hasActiveFilters) {
                  // empty due to both search and filters
                  return (
                    <EmptyState 
                      title="No matches found"
                      message={`No characters found for "${q}" with your current filters`}
                      icon="🔍"
                    />
                  );
                } else if (hasSearchQuery) {
                  // empty due to search only
                  return (
                    <EmptyState 
                      title="No matches"
                      message={`No characters found for "${q}"`}
                      icon="🔍"
                    />
                  );
                } else {
                  // fallback/default empty state
                  return (
                    <EmptyState 
                      title="No characters available"
                      message="Try searching for a character name above"
                      icon="🎭"
                    />
                  );
                }
              }}
            />
          </View>
        )}

        <ScrollView style={{ flex: 1, paddingVertical: theme.spacing.md}}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.md }}>
            <Target size={20} color={theme.colors.text} />
            <Text style={{ 
              fontSize: theme.typography.sizes.lg, 
              fontWeight: theme.typography.weights.semibold, 
              marginLeft: theme.spacing.sm,
              color: theme.colors.text
            }}>
              Previous Guesses
            </Text>
          </View>
          
          {guesses.length === 0 ? (
            <EmptyState 
              title="No guesses yet"
              message="Search for a character above and tap to make your first guess!"
              icon="🎲"
            />
          ) : (
            <View style={{ gap: 12 }}>
              {guesses.map(({ c, hints, sim }, i) => (
                <View key={i} style={{ 
                  borderWidth: 1, 
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.surface,
                  ...theme.shadows.sm
                }}>
                  <View>
                  <CharacterCard
                    item={c}
                    onPress={() => {}}
                    onInfo={() => navigation.navigate("CharacterDetail", { id: c.id })}
                  />
                </View>
                  <View style={{ paddingHorizontal: theme.spacing.lg }}>
                    <HintChips hints={hints} character={c} />
                  </View>
                  <View style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginTop: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.lg,
                    paddingBottom: theme.spacing.md
                  }}>
                    <Thermometer size={14} color={theme.colors.textMuted} />
                    <Text style={{ 
                      color: theme.colors.textMuted, 
                      fontSize: theme.typography.sizes.xs, 
                      marginLeft: theme.spacing.xs,
                      fontWeight: theme.typography.weights.medium,
                      flex: 1
                    }}>
                      {similarityLabel(sim)} - {
                      hints.find(h=>h.field==="episodeCount")?.result === "higher" ? "Try characters with more episodes" :
                      hints.find(h=>h.field==="episodeCount")?.result === "lower"  ? "Try characters with fewer episodes" : 
                      sim >= 5 ? "Very close! Check the remaining differences" :
                      sim >= 3 ? "Getting warmer, some attributes match" :
                      "Keep searching, many differences"
                    }
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* win/lose modal */}
      <Modal visible={gameOver} transparent animationType="slide">
        <View style={{ 
          flex: 1, 
          justifyContent: "flex-end", 
          backgroundColor: theme.colors.overlay 
        }}>
          <View style={{ 
            backgroundColor: theme.colors.surface, 
            padding: theme.spacing.xxl, 
            borderTopLeftRadius: theme.borderRadius.xl, 
            borderTopRightRadius: theme.borderRadius.xl,
            paddingBottom: insets.bottom + theme.spacing.xxl,
            ...theme.shadows.lg
          }}>
            <View style={{ alignItems: "center", marginBottom: theme.spacing.lg }}>
              {win ? (
                <Trophy size={48} color={theme.colors.success} style={{ marginBottom: theme.spacing.sm }} />
              ) : (
                <Target size={48} color={theme.colors.error} style={{ marginBottom: theme.spacing.sm }} />
              )}
              <Text style={{ 
                fontSize: theme.typography.sizes.xxl, 
                fontWeight: theme.typography.weights.bold, 
                textAlign: "center",
                color: win ? theme.colors.success : theme.colors.error
              }}>
                {win ? "Congratulations!" : "Game Over"}
              </Text>
            </View>
            
            {/* character image and name */}
            <View style={{ alignItems: "center", marginBottom: theme.spacing.lg }}>
              {target?.image && (
                <Image 
                  source={{ uri: target.image }} 
                  style={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: theme.borderRadius.lg,
                    borderWidth: 3,
                    borderColor: win ? theme.colors.success : theme.colors.error,
                    marginBottom: theme.spacing.md
                  }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={300}
                />
              )}
              <Text style={{ 
                fontSize: theme.typography.sizes.xl, 
                fontWeight: theme.typography.weights.bold, 
                textAlign: "center",
                color: theme.colors.text,
                marginBottom: theme.spacing.xs
              }}>
                {target?.name}
              </Text>
              
              <Text style={{ 
                fontSize: theme.typography.sizes.sm, 
                textAlign: "center", 
                marginBottom: theme.spacing.md,
                color: theme.colors.textSecondary
              }}>
                {target?.species} from {target?.origin?.name}
              </Text>
            </View>
            
            <Text style={{ 
              fontSize: theme.typography.sizes.md, 
              textAlign: "center", 
              marginBottom: theme.spacing.md,
              color: theme.colors.text,
              fontWeight: theme.typography.weights.medium
            }}>
              {win 
                ? `Found in ${guesses.length} guess${guesses.length === 1 ? '' : 'es'}!`
                : "Better luck next time!"
              }
            </Text>
            
            {win && (
              <Text style={{ 
                fontSize: theme.typography.sizes.sm, 
                textAlign: "center", 
                marginBottom: theme.spacing.xxl,
                color: theme.colors.textSecondary,
                fontWeight: theme.typography.weights.medium
              }}>
                Completed in {formatTime(gameTime)}
              </Text>
            )}
            
            <Pressable 
              onPress={initialiseGame}
              style={({ pressed }) => ({
                backgroundColor: pressed ? theme.colors.primary + 'DD' : theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.lg,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                ...theme.shadows.md
              })}
            >
              <RefreshCw size={20} color={theme.colors.surface} style={{ marginRight: theme.spacing.sm }} />
              <Text style={{ 
                color: theme.colors.surface, 
                fontSize: theme.typography.sizes.md, 
                fontWeight: theme.typography.weights.semibold 
              }}>
                Play Again
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* filter modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        constraints={constraints}
        onApplyFilters={setConstraints}
        availableValues={availableValues}
      />
      </View>
    </OfflineGuard>
  );
}
