import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useJobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SavedJobsScreen = ({ navigation }: any) => {
  const { savedJobs, removeJob, isJobSaved, isJobApplied } = useJobContext();
  const { theme } = useThemeContext();
  const { isAuthenticated } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: theme.spacing.md,
      paddingTop: 70,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      minHeight: 400,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: theme.spacing.lg,
      opacity: 0.5,
    },
    emptyText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: theme.spacing.lg,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    loginButtonText: {
      color: theme.colors.surface,
      fontSize: 15,
      fontWeight: '700',
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    headerText: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: '700',
    },
    count: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      marginTop: theme.spacing.xs,
    },
  });

  // Show login required when not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyText}>Login Required</Text>
          <Text style={styles.emptySubtext}>
            Please login to view and manage your saved jobs
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show empty state when authenticated but no saved jobs
  if (savedJobs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💼</Text>
          <Text style={styles.emptyText}>No saved jobs yet</Text>
          <Text style={styles.emptySubtext}>
            Browse jobs and tap the heart icon to save them here for later
          </Text>
        </View>
      </View>
    );
  }

  // Show saved jobs list when authenticated and has saved jobs
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={savedJobs}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>Your Saved Jobs</Text>
            <Text style={styles.count}>
              {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onSave={() => removeJob(item.id)}
            onApply={() => navigation.navigate('ApplicationForm', { job: item })}
            isSaved={isJobSaved(item.id)}
            isApplied={isJobApplied(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};