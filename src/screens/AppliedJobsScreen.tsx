import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useJobContext } from '../context/JobContext';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const AppliedJobsScreen = ({ navigation }: any) => {
  const { applications, jobs } = useJobContext();
  const { theme } = useThemeContext();
  const { isAuthenticated } = useAuth();

  // Debug logging
  React.useEffect(() => {
    console.log('=== APPLIED JOBS DEBUG ===');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Total applications:', applications.length);
    console.log('Applications:', JSON.stringify(applications, null, 2));
  }, [applications, isAuthenticated]);

  // Get job details for each application - only show if authenticated
  const appliedJobsWithDetails = isAuthenticated ? applications.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      jobTitle: app.jobTitle || job?.title || 'Unknown Position',
      company: app.company || job?.company || 'Unknown Company',
      appliedDate: new Date(app.appliedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  }).reverse() : []; // Show newest first, or empty if not authenticated

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9500'; // Orange
      case 'accepted':
        return theme.colors.success;
      case 'rejected':
        return '#FF3B30'; // Red
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📝';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: theme.spacing.md,
      paddingTop: 70,
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
    applicationCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    cardLeft: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    jobTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    company: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
    },
    statusIcon: {
      fontSize: 14,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'capitalize',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
      opacity: 0.5,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    infoIcon: {
      fontSize: 14,
      marginRight: 8,
      width: 20,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      flex: 1,
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
    browseButton: {
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
    browseButtonText: {
      color: theme.colors.surface,
      fontSize: 15,
      fontWeight: '700',
    },
  });

  if (appliedJobsWithDetails.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{isAuthenticated ? '📋' : '🔒'}</Text>
          <Text style={styles.emptyText}>
            {isAuthenticated ? 'No Applications Yet' : 'Login Required'}
          </Text>
          <Text style={styles.emptySubtext}>
            {isAuthenticated
              ? 'Start applying to jobs and track your applications here'
              : 'Please login to view your job applications'}
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate(isAuthenticated ? 'JobFinder' : 'Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>
              {isAuthenticated ? 'Browse Jobs' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={appliedJobsWithDetails}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>My Applications</Text>
            <Text style={styles.count}>
              {appliedJobsWithDetails.length}{' '}
              {appliedJobsWithDetails.length === 1 ? 'application' : 'applications'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.applicationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                <Text style={styles.company}>{item.company}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { borderColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                <Text
                  style={[styles.statusText, { color: getStatusColor(item.status) }]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoText}>Applied on {item.appliedDate}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🆔</Text>
              <Text style={styles.infoText} numberOfLines={1}>
                ID: {item.id}
              </Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};