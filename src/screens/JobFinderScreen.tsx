import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Alert,
} from 'react-native';
import { useJobContext } from '../context/JobContext';
import { fetchJobs } from '../api/jobs';
import { JobCard } from '../components/JobCard';
import { SearchBar, FilterOptions } from '../components/SearchBar';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const JobFinderScreen = ({ navigation }: any) => {
  const { jobs, addJob, removeJob, setJobs, isJobSaved, isJobApplied } = useJobContext();
  const { theme, isDark, toggleTheme } = useThemeContext();
  const { user, logout, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: [],
    workModel: [],
    seniority: [],
    salaryRange: 'All',
  });
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollY] = useState(new Animated.Value(0));

  const loadJobs = async () => {
    try {
      setError(null);
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Log some salary examples
    if (jobs.length > 0) {
      console.log('=== SALARY FORMAT EXAMPLES ===');
      jobs.slice(0, 5).forEach((job, i) => {
        console.log(`Job ${i}: ${job.title}`);
        console.log(`  Salary: "${job.salary}"`);
      });
    }

    // Apply search
    if (search.trim() !== '') {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job =>
        filters.jobType.includes(job.jobType)
      );
    }

    // Apply work model filter
    if (filters.workModel.length > 0) {
      filtered = filtered.filter(job =>
        filters.workModel.includes(job.workModel)
      );
    }

    // Apply seniority filter
    if (filters.seniority.length > 0) {
      filtered = filtered.filter(job =>
        filters.seniority.includes(job.seniority)
      );
    }

    // Apply salary range filter
    if (filters.salaryRange !== 'All') {
      filtered = filtered.filter(job => {
        if (job.salary === 'Salary not specified') return false;
        
        // Extract all numbers from salary string (handles formats like "USD 50,000 - 80,000" or "$50k")
        const salaryStr = job.salary.replace(/,/g, ''); // Remove commas
        const numbers = salaryStr.match(/\d+/g);
        
        if (!numbers || numbers.length === 0) return false;
        
        // Get the minimum salary value (first number in the string)
        let minSalary = parseInt(numbers[0]);
        
        // Handle "k" suffix (e.g., "50k" = 50000)
        if (salaryStr.includes('k') || salaryStr.includes('K')) {
          minSalary = minSalary * 1000;
        }
        
        // If the number is already in thousands (< 1000), multiply by 1000
        if (minSalary < 1000) {
          minSalary = minSalary * 1000;
        }
        
        console.log(`Filtering job: ${job.title}, Salary: ${job.salary}, Parsed: ${minSalary}`);
        
        switch (filters.salaryRange) {
          case 'Under $50k':
            return minSalary < 50000;
          case '$50k - $100k':
            return minSalary >= 50000 && minSalary < 100000;
          case '$100k - $150k':
            return minSalary >= 100000 && minSalary < 150000;
          case '$150k - $200k':
            return minSalary >= 150000 && minSalary < 200000;
          case 'Over $200k':
            return minSalary >= 200000;
          default:
            return true;
        }
      });
    }

    setFilteredJobs(filtered);
  }, [search, jobs, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const handleAuthButton = () => {
    if (isAuthenticated) {
      // User is logged in - show logout confirmation
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: logout 
          },
        ]
      );
    } else {
      // User is not logged in - navigate to login
      navigation.navigate('Login');
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    animatedHeader: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingTop: 70, // Added top padding to lower content
      paddingBottom: theme.spacing.md,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'center',
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    authButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: isAuthenticated ? theme.colors.surface : theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      minWidth: 80,
    },
    authButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: isAuthenticated ? theme.colors.text : theme.colors.surface,
    },
    themeIcon: {
      fontSize: 20,
    },
    resultCount: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    content: {
      flex: 1,
    },
    listContent: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingContent: {
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      fontSize: 16,
      fontWeight: '500',
    },
    loadingSubtext: {
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontSize: 14,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    errorIcon: {
      fontSize: 64,
      marginBottom: theme.spacing.md,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    errorText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 22,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    retryButtonText: {
      color: theme.colors.surface,
      fontWeight: '600',
      fontSize: 16,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl * 2,
      paddingHorizontal: theme.spacing.xl,
    },
    emptyIcon: {
      fontSize: 72,
      marginBottom: theme.spacing.lg,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Finding opportunities</Text>
          <Text style={styles.loadingSubtext}>Please wait...</Text>
        </View>
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Connection Issue</Text>
        <Text style={styles.errorText}>
          We couldn't load job listings. Please check your internet connection and try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadJobs} activeOpacity={0.8}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            transform: [{ translateY: headerHeight }],
            opacity: headerOpacity,
          },
        ]}
      >
        <View style={styles.topBar}>
          <View style={styles.titleContainer}>
            {isAuthenticated ? (
              <Text style={styles.greeting}>
                Welcome back, <Text style={styles.userName}>{user?.name}</Text>
              </Text>
            ) : (
              <Text style={styles.greeting}>
                Welcome! Login to apply for jobs
              </Text>
            )}
            <Text style={styles.title}>Find Your Dream Job</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.themeButton}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuthButton}
              activeOpacity={0.7}
            >
              <Text style={styles.authButtonText}>
                {isAuthenticated ? 'Logout' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar 
          value={search} 
          onChangeText={setSearch}
          onFilterChange={setFilters}
        />
      </Animated.View>

      {filteredJobs.length > 0 && (
        <Text style={styles.resultCount}>
          {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
        </Text>
      )}

      <Animated.FlatList
        style={styles.content}
        contentContainerStyle={styles.listContent}
        data={filteredJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onSave={() => {
              if (isJobSaved(item.id)) {
                removeJob(item.id);
              } else {
                addJob(item);
              }
            }}
            onApply={() => navigation.navigate('ApplicationForm', { job: item })}
            isSaved={isJobSaved(item.id)}
            isApplied={isJobApplied(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {search ? '🔍' : '💼'}
            </Text>
            <Text style={styles.emptyTitle}>
              {search ? 'No Results Found' : 'No Jobs Available'}
            </Text>
            <Text style={styles.emptyText}>
              {search
                ? `We couldn't find any jobs matching "${search}". Try adjusting your search.`
                : 'Check back soon for new opportunities.'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};