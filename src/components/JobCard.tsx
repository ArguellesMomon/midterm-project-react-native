import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Job } from '../types';
import { useThemeContext } from '../context/ThemeContext';

interface Props {
  job: Job;
  onSave: () => void;
  onApply: () => void;
  isSaved: boolean;
  isApplied: boolean;
}

export const JobCard: React.FC<Props> = ({ job, onSave, onApply, isSaved, isApplied }) => {
  const { theme, isDark } = useThemeContext();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [imageError, setImageError] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    cardWrapper: {
      marginBottom: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    accentBar: {
      height: 4,
      backgroundColor: theme.colors.primary,
    },
    cardContent: {
      padding: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    headerLeft: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 122, 255, 0.1)',
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: 26,
    },
    companyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    companyLogo: {
      width: 32,
      height: 32,
      borderRadius: 6,
      marginRight: 10,
      backgroundColor: theme.colors.border,
    },
    companyIcon: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    companyIconText: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    company: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontWeight: '500',
      flex: 1,
    },
    salaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    salaryIcon: {
      marginRight: 6,
      fontSize: 14,
    },
    salary: {
      fontSize: 17,
      color: theme.colors.success,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
      opacity: 0.5,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 21,
      marginBottom: theme.spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    saveButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isSaved ? theme.colors.success : theme.colors.border,
      backgroundColor: isSaved
        ? isDark
          ? 'rgba(48, 209, 88, 0.15)'
          : 'rgba(52, 199, 89, 0.1)'
        : 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
    },
    saveIcon: {
      fontSize: 16,
      marginRight: 6,
    },
    saveButtonText: {
      color: isSaved ? theme.colors.success : theme.colors.textSecondary,
      fontWeight: '700',
      fontSize: 14,
    },
    applyButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: isApplied ? theme.colors.success : theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isApplied ? theme.colors.success : theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      opacity: isApplied ? 0.7 : 1,
    },
    applyButtonText: {
      color: theme.colors.surface,
      fontWeight: '700',
      fontSize: 15,
      letterSpacing: 0.3,
    },
  });

  return (
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.card}>
          <View style={styles.accentBar} />
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.title}>{job.title}</Text>
              </View>
            </View>

            <View style={styles.companyRow}>
              {job.companyLogo && !imageError ? (
                <Image
                  source={{ uri: job.companyLogo }}
                  style={styles.companyLogo}
                  onError={() => setImageError(true)}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.companyIcon}>
                  <Text style={styles.companyIconText}>
                    {job.company.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.company}>{job.company}</Text>
            </View>

            <View style={styles.salaryRow}>
              <Text style={styles.salaryIcon}>💰</Text>
              <Text style={styles.salary}>{job.salary}</Text>
            </View>

            {job.description && (
              <>
                <View style={styles.divider} />
                <Text style={styles.description} numberOfLines={3}>
                  {job.description}
                </Text>
              </>
            )}

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={onSave}
                activeOpacity={0.7}
              >
                <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
                <Text style={styles.saveButtonText}>
                  {isSaved ? 'Unsave' : 'Save'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={onApply}
                activeOpacity={0.85}
                disabled={isApplied}
              >
                <Text style={styles.applyButtonText}>
                  {isApplied ? '✓ Applied' : 'Apply Now →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};