import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useJobContext } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { useThemeContext } from '../context/ThemeContext';

export const SavedJobsScreen = ({ navigation }: any) => {
  const { savedJobs, removeJob, isJobSaved, isJobApplied } = useJobContext();
  const { theme } = useThemeContext();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: theme.spacing.md,
      paddingTop: 70, // Added top padding to lower the content
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

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={savedJobs}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          savedJobs.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerText}>Your Saved Jobs</Text>
              <Text style={styles.count}>
                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
              </Text>
            </View>
          ) : null
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💼</Text>
            <Text style={styles.emptyText}>No saved jobs yet</Text>
            <Text style={styles.emptySubtext}>
              Browse jobs and tap the heart icon to save them here for later
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};