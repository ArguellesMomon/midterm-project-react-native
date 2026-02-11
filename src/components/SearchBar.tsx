import React, { useState } from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  jobType: string[];
  workModel: string[];
  seniority: string[];
  salaryRange: string;
}

const JOB_TYPES = ['Full time', 'Part time', 'Contract', 'Internship'];
const WORK_MODELS = ['Remote', 'Hybrid', 'On-site'];
const SENIORITY_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];
const SALARY_RANGES = [
  'All',
  'Under $50k',
  '$50k - $100k',
  '$100k - $150k',
  '$150k - $200k',
  'Over $200k',
];

export const SearchBar: React.FC<Props> = ({ value, onChangeText, onFilterChange }) => {
  const { theme, isDark } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: [],
    workModel: [],
    seniority: [],
    salaryRange: 'All',
  });
  const [slideAnim] = useState(new Animated.Value(0));

  const handleClear = () => {
    onChangeText('');
  };

  const toggleFilter = (category: keyof Omit<FilterOptions, 'salaryRange'>, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [category]: updated };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const setSalaryRange = (range: string) => {
    const newFilters = { ...filters, salaryRange: range };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      jobType: [],
      workModel: [],
      seniority: [],
      salaryRange: 'All',
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const activeFilterCount = 
    filters.jobType.length + 
    filters.workModel.length + 
    filters.seniority.length + 
    (filters.salaryRange !== 'All' ? 1 : 0);

  const openFilters = () => {
    setShowFilters(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowFilters(false));
  };

  const slideTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    searchRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: isFocused ? theme.colors.primary : theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 4,
      shadowColor: isFocused ? theme.colors.primary : '#000',
      shadowOffset: { width: 0, height: isFocused ? 4 : 2 },
      shadowOpacity: isFocused ? 0.15 : 0.05,
      shadowRadius: isFocused ? 8 : 4,
      elevation: isFocused ? 4 : 2,
    },
    searchIcon: {
      fontSize: 18,
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: 12,
    },
    clearButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    clearIcon: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    filterButton: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: activeFilterCount > 0 ? theme.colors.primary : theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: activeFilterCount > 0 ? theme.colors.primary : theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    filterIcon: {
      fontSize: 20,
    },
    filterBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#FF3B30',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterBadgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    clearFiltersButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    clearFiltersText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    filterSection: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    filterChipTextActive: {
      color: theme.colors.surface,
      fontWeight: '600',
    },
    doneButton: {
      margin: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    doneButtonText: {
      color: theme.colors.surface,
      fontSize: 17,
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search jobs or companies..."
            placeholderTextColor={theme.colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilters}
          activeOpacity={0.7}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilters}
        transparent
        animationType="fade"
        onRequestClose={closeFilters}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeFilters}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideTranslate }] },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Job Type */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Job Type</Text>
                <View style={styles.filterOptions}>
                  {JOB_TYPES.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterChip,
                        filters.jobType.includes(type) && styles.filterChipActive,
                      ]}
                      onPress={() => toggleFilter('jobType', type)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.jobType.includes(type) && styles.filterChipTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Work Model */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Work Model</Text>
                <View style={styles.filterOptions}>
                  {WORK_MODELS.map(model => (
                    <TouchableOpacity
                      key={model}
                      style={[
                        styles.filterChip,
                        filters.workModel.includes(model) && styles.filterChipActive,
                      ]}
                      onPress={() => toggleFilter('workModel', model)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.workModel.includes(model) && styles.filterChipTextActive,
                        ]}
                      >
                        {model}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Seniority Level */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Seniority Level</Text>
                <View style={styles.filterOptions}>
                  {SENIORITY_LEVELS.map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.filterChip,
                        filters.seniority.includes(level) && styles.filterChipActive,
                      ]}
                      onPress={() => toggleFilter('seniority', level)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.seniority.includes(level) && styles.filterChipTextActive,
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Salary Range */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Salary Range</Text>
                <View style={styles.filterOptions}>
                  {SALARY_RANGES.map(range => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.filterChip,
                        filters.salaryRange === range && styles.filterChipActive,
                      ]}
                      onPress={() => setSalaryRange(range)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.salaryRange === range && styles.filterChipTextActive,
                        ]}
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={closeFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};