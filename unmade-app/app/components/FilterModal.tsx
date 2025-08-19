import { useState, useEffect, useRef } from "react";
import { View, Text, Modal, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Filter, RotateCcw } from "lucide-react-native";
import { useTheme } from "../theme";
import type { Constraints } from "../game/constraints";

function EpisodeRangeInput({ 
  minValue, 
  maxValue,
  onRangeChange,
  maxEpisodes,
  scrollViewRef
}: { 
  minValue?: number;
  maxValue?: number;
  onRangeChange: (min?: number, max?: number) => void;
  maxEpisodes: number;
  scrollViewRef?: React.RefObject<ScrollView | null>;
}) {
  const { theme } = useTheme();
  const [minInputValue, setMinInputValue] = useState(minValue?.toString() || '');
  const [maxInputValue, setMaxInputValue] = useState(maxValue?.toString() || '');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const minInputRef = useRef<TextInput>(null);
  const maxInputRef = useRef<TextInput>(null);
  const episodeContainerRef = useRef<View>(null);
  
  // sync/reset input values when constraint values change for example when modal is reset
  useEffect(() => {
    setMinInputValue(minValue?.toString() || '');
  }, [minValue]);
  
  useEffect(() => {
    setMaxInputValue(maxValue?.toString() || '');
  }, [maxValue]);
  
  // tracks keyboard visibility for mobile so i can scroll to the episode range input
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);
  
  const handleMinInputChange = (text: string) => {
    setMinInputValue(text);
    
    if (text === '') {
      onRangeChange(undefined, maxValue);
      return;
    }
    
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      onRangeChange(num, maxValue);
    } else {
      onRangeChange(undefined, maxValue);
    }
  };
  
  const handleMaxInputChange = (text: string) => {
    setMaxInputValue(text);
    
    if (text === '') {
      onRangeChange(minValue, undefined);
      return;
    }
    
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      onRangeChange(minValue, num);
    } else {
      onRangeChange(minValue, undefined);
    }
  };
  
  const handleInputFocus = () => {
    // mobile specific scrolling to input, not needed in web
    if (!keyboardVisible && Platform.OS !== 'web') {
      setTimeout(() => {
        // measure the episode container's position within the ScrollView
        episodeContainerRef.current?.measureLayout(
          scrollViewRef?.current as any,
          (x, y) => {
            // scroll to position the episode section title in view
            const targetY = Math.max(0, y - (Platform.OS === 'ios' ? 200 : 150));
            scrollViewRef?.current?.scrollTo({
              y: targetY,
              animated: true
            });
          },
          () => {
            // goofy fallback to fixed position if measurement fails
            scrollViewRef?.current?.scrollTo({
              y: Platform.OS === 'ios' ? 800 : 600, // the else is android btw
              animated: true
            });
          }
        );
      }, Platform.OS === 'ios' ? 100 : 150);
    }
  };
  
  return (
    <View ref={episodeContainerRef} style={{ marginVertical: theme.spacing.lg }}>
      <Text style={{ 
        fontSize: theme.typography.sizes.md, 
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md
      }}>
        Episode Count Range
      </Text>
      
      <View style={{ flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: theme.typography.sizes.sm, 
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xs
          }}>
            From
          </Text>
          <TextInput
            ref={minInputRef}
            value={minInputValue}
            onChangeText={handleMinInputChange}
            placeholder="Min episodes"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => maxInputRef.current?.focus()}
            onFocus={handleInputFocus}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.md,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              fontSize: theme.typography.sizes.md,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            }}
          />
        </View>
        
        <Text style={{ 
          fontSize: theme.typography.sizes.md, 
          color: theme.colors.textSecondary,
          marginTop: theme.spacing.lg
        }}>
          to
        </Text>
        
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: theme.typography.sizes.sm, 
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xs
          }}>
            To
          </Text>
          <TextInput
            ref={maxInputRef}
            value={maxInputValue}
            onChangeText={handleMaxInputChange}
            placeholder="Max episodes"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="numeric"
            returnKeyType="done"
            onFocus={handleInputFocus}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.md,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              fontSize: theme.typography.sizes.md,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            }}
          />
        </View>
      </View>
      
      <Text style={{ 
        fontSize: theme.typography.sizes.sm, 
        color: theme.colors.textMuted,
        marginTop: theme.spacing.sm
      }}>
        Filter characters by episode count range (1-{maxEpisodes}). Leave blank for no limit.
      </Text>
    </View>
  );
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  constraints: Constraints;
  onApplyFilters: (constraints: Constraints) => void;
  availableValues: {
    statuses: string[];
    species: string[];
    types: string[];
    genders: string[];
    origins: string[];
    locations: string[];
    maxEpisodes: number;
  };
}

export default function FilterModal({ 
  visible, 
  onClose, 
  constraints, 
  onApplyFilters,
  availableValues 
}: FilterModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [localConstraints, setLocalConstraints] = useState<Constraints>(constraints);
  
  // sync constraints when modal opens or constraints change
  useEffect(() => {
    if (visible) {
      setLocalConstraints(constraints);
    }
  }, [visible, constraints]);


  // the filter section and option buttons component
  const FilterSection = ({ title, options, field }: { 
    title: string; 
    options: string[]; 
    field: keyof Constraints;
  }) => (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text style={{ 
        fontSize: theme.typography.sizes.md, 
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md
      }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {options.map(option => {
          const isSelected = localConstraints[field] === option;
          return (
            <Pressable
              key={option}
              onPress={() => {
                setLocalConstraints(prev => ({
                  ...prev,
                  [field]: isSelected ? undefined : option
                }));
              }}
              style={({ pressed }) => ({
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                backgroundColor: isSelected 
                  ? theme.colors.primaryBackground 
                  : pressed 
                    ? theme.colors.surfaceSecondary 
                    : theme.colors.surface,
                ...theme.shadows.sm
              })}
            >
              <Text style={{
                color: isSelected ? theme.colors.primary : theme.colors.text,
                fontSize: theme.typography.sizes.sm,
                fontWeight: isSelected ? theme.typography.weights.semibold : theme.typography.weights.medium
              }}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const handleApply = () => {
    onApplyFilters(localConstraints);
    onClose();
  };

  const handleReset = () => {
    setLocalConstraints({});
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: theme.colors.background,
          paddingTop: insets.top 
        }}>
        {/* header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Filter size={24} color={theme.colors.primary} />
            <Text style={{ 
              fontSize: theme.typography.sizes.lg, 
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginLeft: theme.spacing.sm
            }}>
              Filter Characters
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <Pressable 
              onPress={handleReset}
              style={({ pressed }) => ({
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                backgroundColor: pressed ? theme.colors.surfaceSecondary : 'transparent'
              })}
            >
              <RotateCcw size={20} color={theme.colors.textSecondary} />
            </Pressable>
            
            <Pressable 
              onPress={onClose}
              style={({ pressed }) => ({
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                backgroundColor: pressed ? theme.colors.surfaceSecondary : 'transparent'
              })}
            >
              <X size={20} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* content */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1, padding: theme.spacing.lg }}
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === 'ios' ? 150 : theme.spacing.xl 
          }}
          keyboardShouldPersistTaps="handled"
        >
          <FilterSection 
            title="Status" 
            options={availableValues.statuses} 
            field="status" 
          />
          
          <FilterSection 
            title="Species" 
            options={availableValues.species} 
            field="species" 
          />
          
          <FilterSection 
            title="Type" 
            options={availableValues.types.filter(t => t !== "")} 
            field="type" 
          />
          
          <FilterSection 
            title="Gender" 
            options={availableValues.genders} 
            field="gender" 
          />
          
          <FilterSection 
            title="Origin" 
            options={availableValues.origins} 
            field="origin" 
          />
          
          <FilterSection 
            title="Location" 
            options={availableValues.locations} 
            field="location" 
          />
          
          <EpisodeRangeInput
            minValue={localConstraints.epsMin}
            maxValue={localConstraints.epsMax}
            onRangeChange={(min, max) => {
              setLocalConstraints(prev => ({
                ...prev,
                epsMin: min,
                epsMax: max
              }));
            }}
            maxEpisodes={availableValues.maxEpisodes}
            scrollViewRef={scrollViewRef}
          />
        </ScrollView>

        {/* footer */}
        <View style={{ 
          padding: theme.spacing.lg,
          paddingBottom: insets.bottom + theme.spacing.lg,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface
        }}>
          <Pressable 
            onPress={handleApply}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.colors.primary + 'DD' : theme.colors.primary,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.lg,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              ...theme.shadows.md
            })}
          >
            <Filter size={20} color={theme.colors.surface} style={{ marginRight: theme.spacing.sm }} />
            <Text style={{ 
              color: theme.colors.surface, 
              fontSize: theme.typography.sizes.md, 
              fontWeight: theme.typography.weights.semibold 
            }}>
              Apply Filters
            </Text>
          </Pressable>
        </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
