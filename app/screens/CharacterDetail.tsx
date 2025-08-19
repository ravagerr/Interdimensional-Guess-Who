import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useQuery } from "@apollo/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CHARACTER } from "../graphql/queries";
import { useTheme } from "../theme";
import { ArrowLeft } from "lucide-react-native";
import OfflineGuard from "../components/OfflineGuard";

export default function CharacterDetail({ route, navigation }: any) { 
  const { theme } = useTheme();
  const { id } = route.params as { id: string };
  const { data, loading, error } = useQuery(CHARACTER, { variables: { id } });
  const insets = useSafeAreaInsets();
  const c = data?.character;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top, backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Loading character details...</Text>
      </View>
    );
  }

  if (error || !c) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: insets.top, backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Failed to load character details</Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: theme.spacing.lg, padding: theme.spacing.lg, borderWidth: 1, borderRadius: theme.borderRadius.md }}>
          <Text style={{ color: theme.colors.text }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "alive": return "#10b981";
      case "dead": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <OfflineGuard 
      title="Character Details Require Internet" 
      message="Character details need an internet connection to load. Please connect to the internet to view character information!"
      showRetry={true}
      onRetry={() => navigation.goBack()}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: insets.top }}>
      {/* header */}
      <View style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
      }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginRight: theme.spacing.xl,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: theme.colors.surface,
          }}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={{ 
          fontSize: theme.typography.sizes.lg, 
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.text,
          flex: 1
        }}>
          Character Details
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}>
        {/* character image & basic info */}
        <View style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          alignItems: "center",
          borderWidth: 1,
          borderColor: theme.colors.border
        }}>
          <Image 
            source={{ uri: c.image }} 
            style={{ 
              width: 120, 
              height: 120, 
              borderRadius: theme.borderRadius.lg,
              marginBottom: theme.spacing.lg
            }}
            contentFit="cover"
          />
          
          <Text style={{ 
            fontSize: theme.typography.sizes.lg, 
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            textAlign: "center",
            marginBottom: theme.spacing.sm
          }}>
            {c.name}
          </Text>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.sm
          }}>
            <View style={{
              width: theme.spacing.md,
              height: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              backgroundColor: getStatusColor(c.status),
              marginRight: theme.spacing.xs
            }} />
            <Text style={{ 
              fontSize: theme.typography.sizes.sm, 
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.text
            }}>
              {c.status}
            </Text>
          </View>

          <Text style={{ color: theme.colors.textSecondary, textAlign: "center" }}>
            {c.species}{c.type ? ` (${c.type})` : ""} • {c.gender}
          </Text>
        </View>

        {/* origin */}
        <View style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border
        }}>
            <Text style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.semibold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
            Origin
          </Text>
          <Text style={{ fontSize: theme.typography.sizes.md, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
            {c.origin?.name ?? "Unknown"}
          </Text>
          {c.origin?.type && (
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Type: {c.origin.type}
            </Text>
          )}
          {c.origin?.dimension && (
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Dimension: {c.origin.dimension}
            </Text>
          )}
        </View>

        {/* current location */}
        <View style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border
        }}>
          <Text style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.semibold, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
            Current Location
          </Text>
          <Text style={{ fontSize: theme.typography.sizes.md, color: theme.colors.text, marginBottom: theme.spacing.sm }}>
            {c.location?.name ?? "Unknown"}
          </Text>
          {c.location?.type && (
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Type: {c.location.type}
            </Text>
          )}
          {c.location?.dimension && (
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Dimension: {c.location.dimension}
            </Text>
          )}
          {c.location?.residents && (
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Residents: {c.location.residents.length}
            </Text>
          )}
        </View>

        {/* episode appearances */}
        <View style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border
        }}>
          <Text style={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Episode Appearances ({c.episode?.length ?? 0})
          </Text>
          
          {c.episode && c.episode.length > 0 ? (
            <FlatList
              data={c.episode.slice(0, 10)} // Show first 10 episodes
              keyExtractor={(e: any) => e.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                  <Text style={{ fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.medium, color: theme.colors.text }}>
                    {item.episode} - {item.name}
                  </Text>
                  <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                    {item.air_date}
                  </Text>
                </View>
              )}
              ListFooterComponent={() => (
                c.episode && c.episode.length > 10 ? (
                  <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, textAlign: "center", marginTop: theme.spacing.sm }}>
                    ... and {c.episode.length - 10} more episodes
                  </Text>
                ) : null
              )}
            />
          ) : (
            <Text style={{ color: theme.colors.textSecondary, fontStyle: "italic" }}>
              No episode information available
            </Text>
          )}
        </View>

        {/* quick stats */}
        <View style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginBottom: 20
        }}>
          <Text style={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Quick Stats
          </Text>
          
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.text }}>
              🎭 Character ID: #{c.id}
            </Text>
            
            {c.origin?.name !== c.location?.name && (
              <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.text }}>
                🌍 Traveled from {c.origin?.name || "Unknown"} to {c.location?.name || "Unknown"}
              </Text>
            )}
            
            {c.episode && c.episode.length === 1 && (
              <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.text }}>
                ⭐ Rare character - only appears in one episode!
              </Text>
            )}
            
            {c.episode && c.episode.length > 30 && (
              <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.text }}>
                🌟 Main character - appears in {c.episode.length} episodes!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      </View>
    </OfflineGuard>
  );
}
