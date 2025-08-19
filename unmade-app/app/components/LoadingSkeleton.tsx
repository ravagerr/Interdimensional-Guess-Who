import { View } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../theme";

export default function LoadingSkeleton() {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;
  const repeat = 3

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View>
      {Array.from({ length: repeat }).map((_, index) => (
        <View key={index} style={{ paddingVertical: theme.spacing.md, paddingHorizontal: 0 }}>
          <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
            <Animated.View 
              style={{
                width: 56,
                height: 56,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.surface,
                opacity
              }}
            />
            <View style={{ flex: 1, justifyContent: "center", gap: 6 }}>
              <Animated.View 
                style={{
                  height: 16,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  width: "60%",
                  opacity
                }}
              />
              <Animated.View 
                style={{
                  height: 14,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                  width: "40%",
                  opacity
                }}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
