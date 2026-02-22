import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useJobContext } from '../context/JobContext';
import { Job } from '../types';

interface Props {
  route: any;
  navigation: any;
}

export const JobDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params as { job: Job };
  const { theme, isDark } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const { isJobSaved, isJobApplied, addJob, removeJob } = useJobContext();
  const [imageError, setImageError] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));

  const isSaved = isJobSaved(job.id);
  const isApplied = isJobApplied(job.id);

  const handleApply = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login or create an account to apply for jobs',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    if (job.applyUrl) {
      Alert.alert(
        'Apply Externally',
        'This will open the application page in your browser.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue',
            onPress: () => Linking.openURL(job.applyUrl)
          },
        ]
      );
    } else {
      navigation.navigate('ApplicationForm', { job });
    }
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login or create an account to save jobs',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    if (isSaved) {
      removeJob(job.id);
    } else {
      addJob(job);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 100, // Space for floating buttons
    },
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    companyLogoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    companyLogo: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: theme.colors.border,
    },
    companyIconLarge: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    companyIconText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    jobTitle: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      lineHeight: 34,
    },
    company: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontWeight: '500',
      marginBottom: theme.spacing.md,
    },
    headerTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    tag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: isDark ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 122, 255, 0.1)',
    },
    tagText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    salary: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.success,
      textAlign: 'center',
    },
    content: {
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    infoCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '600',
    },
    description: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    skillTag: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    skillTagText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    sourceCard: {
      backgroundColor: isDark ? 'rgba(10, 132, 255, 0.08)' : 'rgba(0, 122, 255, 0.05)',
      padding: theme.spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderStyle: 'dashed',
    },
    sourceText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    sourceLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    floatingButtons: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 10,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    saveButton: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 14,
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
      minWidth: 120,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: isSaved ? theme.colors.success : theme.colors.textSecondary,
      marginLeft: 6,
    },
    applyButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 14,
      backgroundColor: isApplied ? theme.colors.success : theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isApplied ? theme.colors.success : theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      opacity: isApplied ? 0.7 : 1,
    },
    applyButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.surface,
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.lg,
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companyLogoContainer}>
            {job.companyLogo && !imageError ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.companyLogo}
                onError={() => setImageError(true)}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.companyIconLarge}>
                <Text style={styles.companyIconText}>
                  {job.company.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>

          <View style={styles.headerTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>📍 {job.location}</Text>
            </View>
            {job.jobType && job.jobType !== 'Not specified' && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{job.jobType}</Text>
              </View>
            )}
            {job.workModel && job.workModel !== 'Not specified' && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{job.workModel}</Text>
              </View>
            )}
          </View>

          <Text style={styles.salary}>💰 {job.salary}</Text>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Job Information Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Information</Text>
            <View style={styles.infoGrid}>
              {job.seniority && job.seniority !== 'Not specified' && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Seniority Level</Text>
                  <Text style={styles.infoValue}>{job.seniority}</Text>
                </View>
              )}
              {job.jobType && job.jobType !== 'Not specified' && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Job Type</Text>
                  <Text style={styles.infoValue}>{job.jobType}</Text>
                </View>
              )}
              {job.workModel && job.workModel !== 'Not specified' && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Work Model</Text>
                  <Text style={styles.infoValue}>{job.workModel}</Text>
                </View>
              )}
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{job.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Role</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          {/* Skills/Tags */}
          {job.tags && job.tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Required Skills</Text>
                <View style={styles.tagsContainer}>
                  {job.tags.map((tag, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Source Info */}
          {job.source && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <View style={styles.sourceCard}>
                  <Text style={styles.sourceText}>
                    This job is sourced from{' '}
                    <Text style={styles.sourceLink}>{job.source}</Text>
                    {'\n'}
                    Click "Apply Now" to submit your application
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </Animated.ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18 }}>{isSaved ? '❤️' : '🤍'}</Text>
            <Text style={styles.saveButtonText}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.85}
            disabled={isApplied}
          >
            <Text style={styles.applyButtonText}>
              {isApplied ? '✓ Applied' : 'Apply Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};