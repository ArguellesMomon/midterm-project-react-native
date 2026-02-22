import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Job } from '../types';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  job: Job;
  onSave: () => void;
  onApply: () => void;
  isSaved: boolean;
  isApplied: boolean;
}

export const JobCard: React.FC<Props> = ({ job, onSave, onApply, isSaved, isApplied }) => {
  const { theme, isDark } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();
  
  const [scaleAnim] = useState(new Animated.Value(1));
  const [saveAnim] = useState(new Animated.Value(1));
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
    setMounted(true);
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = () => {
    navigation.navigate('JobDetails', { job });
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    
    // Animate save button
    Animated.sequence([
      Animated.spring(saveAnim, {
        toValue: 1.2,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(saveAnim, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login or create an account to save jobs',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Up',
            onPress: () => {
              navigation.navigate('Register');
            },
          },
          {
            text: 'Login',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]
      );
      return;
    }
    onSave();
  };

  const handleApply = (e: any) => {
    e.stopPropagation();
    onApply();
  };

  const styles = StyleSheet.create({
    cardWrapper: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: 2, // Prevent shadow clipping
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: isDark ? '#000' : theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.4 : 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    accentBar: {
      height: 5,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
    },
    cardContent: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: 21,
      fontWeight: '800',
      color: theme.colors.text,
      lineHeight: 28,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      backgroundColor: isApplied 
        ? theme.colors.success
        : isDark 
          ? 'rgba(10, 132, 255, 0.2)' 
          : 'rgba(0, 122, 255, 0.12)',
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: isApplied ? theme.colors.surface : theme.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    companyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    logoContainer: {
      position: 'relative',
      marginRight: 12,
    },
    companyLogo: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: theme.colors.border,
    },
    companyIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    companyIconText: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.surface,
    },
    verifiedBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    verifiedIcon: {
      fontSize: 8,
      color: theme.colors.surface,
    },
    company: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '600',
      flex: 1,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
    },
    metaIcon: {
      fontSize: 14,
      marginRight: 5,
    },
    metaText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    salaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark 
        ? 'rgba(48, 209, 88, 0.12)' 
        : 'rgba(52, 199, 89, 0.08)',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 12,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.success,
    },
    salaryIcon: {
      fontSize: 18,
      marginRight: 8,
    },
    salary: {
      fontSize: 18,
      color: theme.colors.success,
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
      opacity: 0.3,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    saveButton: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: isSaved ? theme.colors.success : theme.colors.border,
      backgroundColor: isSaved
        ? isDark
          ? 'rgba(48, 209, 88, 0.2)'
          : 'rgba(52, 199, 89, 0.12)'
        : theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 110,
      shadowColor: isSaved ? theme.colors.success : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isSaved ? 0.2 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    saveIcon: {
      fontSize: 18,
      marginRight: 6,
    },
    saveButtonText: {
      color: isSaved ? theme.colors.success : theme.colors.textSecondary,
      fontWeight: '700',
      fontSize: 14,
      letterSpacing: 0.3,
    },
    applyButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 14,
      backgroundColor: isApplied ? theme.colors.success : theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isApplied ? theme.colors.success : theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
    applyButtonDisabled: {
      opacity: 0.7,
    },
    applyButtonText: {
      color: theme.colors.surface,
      fontWeight: '800',
      fontSize: 15,
      letterSpacing: 0.5,
    },
    tapHint: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      opacity: 0.6,
    },
    tapHintText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleCardPress}
      >
        <View style={styles.card}>
          <View style={styles.accentBar} />
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.title}>{job.title}</Text>
                {isApplied && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>✓ Applied</Text>
                  </View>
                )}
              </View>

              {/* Company */}
              <View style={styles.companyRow}>
                <View style={styles.logoContainer}>
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
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedIcon}>✓</Text>
                  </View>
                </View>
                <Text style={styles.company}>{job.company}</Text>
              </View>

              {/* Meta info */}
              <View style={styles.metaRow}>
                {job.location && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.metaText}>{job.location}</Text>
                  </View>
                )}
                {job.workModel && job.workModel !== 'Not specified' && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>💻</Text>
                    <Text style={styles.metaText}>{job.workModel}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Salary */}
            <View style={styles.salaryRow}>
              <Text style={styles.salaryIcon}>💰</Text>
              <Text style={styles.salary}>{job.salary}</Text>
            </View>

            {/* Description */}
            {job.description && (
              <>
                <View style={styles.divider} />
                <Text style={styles.description} numberOfLines={2}>
                  {job.description}
                </Text>
              </>
            )}

            {/* Actions */}
            <View style={styles.footer}>
              <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
                  <Text style={styles.saveButtonText}>
                    {isSaved ? 'Saved' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              
              <TouchableOpacity
                style={[styles.applyButton, isApplied && styles.applyButtonDisabled]}
                onPress={handleApply}
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