import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../theme';
import { useIsOnline } from '../../hooks/useNetworkStatus';

interface OfflineGuardProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function OfflineGuard({ 
  children, 
  title = "No Internet Connection", 
  message = "This feature requires an active internet connection. Please check your connection and try again.",
  showRetry = false,
  onRetry 
}: OfflineGuardProps) {
  const { theme } = useTheme();
  const isOnline = useIsOnline();

  if (isOnline) {
    return <>{children}</>;
  }

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: theme.spacing.xxl,
      backgroundColor: theme.colors.background 
    }}>
      <View style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xxl,
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
        ...theme.shadows.lg
      }}>
        <WifiOff 
          size={64} 
          color={theme.colors.textMuted} 
          style={{ marginBottom: theme.spacing.lg }} 
        />
        
        <Text style={{ 
          fontSize: theme.typography.sizes.xl, 
          fontWeight: theme.typography.weights.bold, 
          textAlign: 'center',
          marginBottom: theme.spacing.md,
          color: theme.colors.text
        }}>
          {title}
        </Text>
        
        <Text style={{ 
          fontSize: theme.typography.sizes.md, 
          textAlign: 'center', 
          lineHeight: 24,
          marginBottom: showRetry ? theme.spacing.xl : 0,
          color: theme.colors.textSecondary
        }}>
          {message}
        </Text>

        {showRetry && onRetry && (
          <Pressable 
            onPress={onRetry}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.colors.primary + 'DD' : theme.colors.primary,
              borderRadius: theme.borderRadius.md,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              alignItems: 'center',
              flexDirection: 'row',
              ...theme.shadows.md
            })}
          >
            <RefreshCw size={20} color={theme.colors.surface} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              color: theme.colors.surface, 
              fontSize: theme.typography.sizes.md, 
              fontWeight: theme.typography.weights.semibold 
            }}>
              Try Again
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
