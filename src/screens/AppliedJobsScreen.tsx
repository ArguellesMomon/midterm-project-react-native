import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { useJobContext } from '../context/JobContext';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const AppliedJobsScreen = () => {
  const { applications, removeApplication } = useJobContext();
  const { theme, isDark } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (jobId: string) => {
    setImageErrors(prev => ({ ...prev, [jobId]: true }));
  };

  const handleRemoveApplication = (applicationId: string, jobTitle: string, company: string) => {
    Alert.alert(
      'Cancel Application',
      `Are you sure you want to cancel your application for ${jobTitle} at ${company}?`,
      [
        {
          text: 'Keep',
          style: 'cancel',
        },
        {
          text: 'Cancel Application',
          style: 'destructive',
          onPress: () => {
            removeApplication(applicationId);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: isDark ? 'rgba(255, 214, 10, 0.15)' : 'rgba(255, 204, 0, 0.1)', text: '#FFA500' };
      case 'accepted':
        return { bg: isDark ? 'rgba(48, 209, 88, 0.15)' : 'rgba(52, 199, 89, 0.1)', text: theme.colors.success };
      case 'rejected':
        return { bg: isDark ? 'rgba(255, 69, 58, 0.15)' : 'rgba(255, 59, 48, 0.1)', text: theme.colors.error };
      default:
        return { bg: isDark ? 'rgba(255, 214, 10, 0.15)' : 'rgba(255, 204, 0, 0.1)', text: '#FFA500' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
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
    header: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingTop: 70,
      paddingBottom: theme.spacing.md,
    },
    titleSection: {
      marginBottom: theme.spacing.lg,
    },
    greeting: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    listContent: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    applicationCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    logoContainer: {
      marginRight: theme.spacing.md,
    },
    companyLogo: {
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: theme.colors.border,
    },
    companyIcon: {
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    companyIconText: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 6,
      lineHeight: 24,
    },
    company: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    statusContainer: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      gap: 4,
    },
    statusIcon: {
      fontSize: 14,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoSection: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    infoIcon: {
      fontSize: 16,
      marginRight: 10,
      width: 24,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
    infoLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: '600',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    cancelButton: {
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.error,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: theme.colors.error,
      fontWeight: '700',
      fontSize: 15,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 3,
      paddingHorizontal: theme.spacing.xl,
    },
    emptyIllustration: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: isDark ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 122, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    emptyIcon: {
      fontSize: 64,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
      maxWidth: 300,
    },
    emptyButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 14,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    emptyButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: '700',
    },
    loginRequiredContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    loginIcon: {
      fontSize: 72,
      marginBottom: theme.spacing.xl,
    },
    loginTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    loginText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
      maxWidth: 300,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 14,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    loginButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: '700',
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const renderLoginRequired = () => (
    <View style={styles.loginRequiredContainer}>
      <Text style={styles.loginIcon}>🔒</Text>
      <Text style={styles.loginTitle}>Login Required</Text>
      <Text style={styles.loginText}>
        Please login to view and track your job applications
      </Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.85}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        <Text style={styles.emptyIcon}>📋</Text>
      </View>
      <Text style={styles.emptyTitle}>No Applications Yet</Text>
      <Text style={styles.emptyText}>
        Start applying to jobs you're interested in and track your progress here
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('JobFinder')}
        activeOpacity={0.85}
      >
        <Text style={styles.emptyButtonText}>Browse Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  // Show login required if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        {renderLoginRequired()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {applications.length > 0 && (
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.greeting}>Track Your Progress</Text>
            <Text style={styles.title}>Applications</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{applications.length}</Text>
              <Text style={styles.statLabel}>
                {applications.length === 1 ? 'Application' : 'Total Applied'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {new Set(applications.map(a => a.company)).size}
              </Text>
              <Text style={styles.statLabel}>
                {new Set(applications.map(a => a.company)).size === 1 ? 'Company' : 'Companies'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={applications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const statusColors = getStatusColor(item.status);
          return (
            <View style={styles.applicationCard}>
              <View style={styles.cardHeader}>
                <View style={styles.logoContainer}>
                  {item.companyLogo && !imageErrors[item.jobId] ? (
                    <Image
                      source={{ uri: item.companyLogo }}
                      style={styles.companyLogo}
                      onError={() => handleImageError(item.jobId)}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.companyIcon}>
                      <Text style={styles.companyIconText}>
                        {item.company.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle} numberOfLines={2}>
                    {item.jobTitle}
                  </Text>
                  <Text style={styles.company}>{item.company}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                    <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                    <Text style={[styles.statusText, { color: statusColors.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📅</Text>
                  <Text style={styles.infoText}>Applied {formatDate(item.appliedAt)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🆔</Text>
                  <Text style={styles.infoText} numberOfLines={1}>
                    ID: {item.id.slice(0, 16)}...
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleRemoveApplication(item.id, item.jobTitle, item.company)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel Application</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={renderEmptyState()}
        contentContainerStyle={applications.length > 0 ? styles.listContent : { flex: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};