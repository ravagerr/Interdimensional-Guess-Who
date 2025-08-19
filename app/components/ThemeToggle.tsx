import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '../theme';

export default function ThemeToggle() {
  const { theme, themeMode, setThemeMode } = useTheme();

  const modes = [
    { key: 'light' as const, icon: Sun, label: 'Light' },
    { key: 'dark' as const, icon: Moon, label: 'Dark' },
    { key: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    }}>
      {modes.map(({ key, icon: Icon, label }) => (
        <Pressable
          key={key}
          onPress={() => setThemeMode(key)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            backgroundColor: themeMode === key 
              ? theme.colors.primary 
              : pressed 
                ? theme.colors.surfaceSecondary 
                : 'transparent',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Icon
            size={16}
            color={themeMode === key ? theme.colors.surface : theme.colors.textSecondary}
          />
          <Text
            style={{
              marginLeft: theme.spacing.xs,
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              color: themeMode === key ? theme.colors.surface : theme.colors.textSecondary,
            }}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
