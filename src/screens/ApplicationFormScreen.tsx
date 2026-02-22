import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { useJobContext } from '../context/JobContext';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const ApplicationFormScreen = ({ route, navigation }: any) => {
  const { job } = route.params;
  const { applyJob, isJobApplied } = useJobContext();
  const { theme, isDark } = useThemeContext();
  const { isAuthenticated, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    reason: '',
  });

  const [progressAnim] = useState(new Animated.Value(0));
  const [headerAnim] = useState(new Animated.Value(0));

  // Check authentication on mount
  useEffect(() => {
    // Animate header entrance
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // First check authentication - if not authenticated, don't check application status
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login or create an account to apply for jobs',
        [
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'Sign Up',
            onPress: () => {
              navigation.goBack();
              setTimeout(() => navigation.replace('Register'), 100);
            },
          },
          {
            text: 'Login',
            onPress: () => {
              navigation.goBack();
              setTimeout(() => navigation.replace('Login'), 100);
            },
          },
        ],
        { cancelable: false }
      );
      return;
    }

    // Only check if already applied when user is authenticated
    if (isJobApplied(job.id)) {
      Alert.alert(
        'Already Applied',
        `You have already applied for ${job.title} at ${job.company}.`,
        [
          {
            text: 'View Applications',
            onPress: () => navigation.navigate('Main', { screen: 'AppliedJobs' }),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
      return;
    }

    // Pre-fill with user data if authenticated
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [isAuthenticated]);

  const calculateProgress = () => {
    let filled = 0;
    if (name.trim()) filled++;
    if (email.trim()) filled++;
    if (contactNumber.trim()) filled++;
    if (reason.trim()) filled++;
    return (filled / 4) * 100;
  };

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: calculateProgress(),
      tension: 40,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [name, email, contactNumber, reason]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      contactNumber: '',
      reason: '',
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!validatePhone(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!reason.trim()) {
      newErrors.reason = 'This field is required';
      isValid = false;
    } else if (reason.trim().length < 20) {
      newErrors.reason = 'Please provide at least 20 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'You must be logged in to apply');
      navigation.replace('Login');
      return;
    }

    if (isJobApplied(job.id)) {
      Alert.alert(
        'Already Applied',
        'You have already submitted an application for this job.',
        [
          {
            text: 'View Applications',
            onPress: () => navigation.navigate('Main', { screen: 'AppliedJobs' }),
          },
          { text: 'OK', style: 'cancel' },
        ]
      );
      return;
    }

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    applyJob({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status: 'pending',
      userId: user?.id || '',
    });

    Alert.alert(
      '🎉 Success!',
      `Your application for ${job.title} at ${job.company} has been submitted!\n\nWe'll notify you if there's any update.`,
      [
        {
          text: 'View Applications',
          onPress: () => navigation.navigate('Main', { screen: 'AppliedJobs' }),
        },
        {
          text: 'Find More Jobs',
          onPress: () => navigation.navigate('Main', { screen: 'JobFinder' }),
          style: 'cancel',
        },
      ]
    );

    setName(user?.name || '');
    setEmail(user?.email || '');
    setContactNumber('');
    setReason('');
    setErrors({ name: '', email: '', contactNumber: '', reason: '' });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
    },
    headerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    companyLogo: {
      width: 60,
      height: 60,
      borderRadius: 14,
      backgroundColor: theme.colors.border,
      marginRight: theme.spacing.md,
    },
    companyIcon: {
      width: 60,
      height: 60,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
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
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
      lineHeight: 26,
    },
    jobCompany: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },
    salaryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: isDark ? 'rgba(48, 209, 88, 0.15)' : 'rgba(52, 199, 89, 0.1)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      marginTop: theme.spacing.sm,
    },
    salaryIcon: {
      fontSize: 16,
      marginRight: 6,
    },
    jobSalary: {
      fontSize: 16,
      color: theme.colors.success,
      fontWeight: '700',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    sectionIcon: {
      fontSize: 24,
      marginRight: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.text,
    },
    inputGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.error || '#FF3B30',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 14,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    inputError: {
      borderColor: theme.colors.error || '#FF3B30',
    },
    inputIcon: {
      position: 'absolute',
      right: 16,
      top: 18,
      fontSize: 18,
    },
    textArea: {
      height: 140,
      textAlignVertical: 'top',
      paddingTop: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error || '#FF3B30',
      fontSize: 13,
      marginTop: theme.spacing.xs,
      marginLeft: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    charCounter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      paddingHorizontal: 4,
    },
    charCount: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    charCountGood: {
      color: theme.colors.success,
      fontWeight: '600',
    },
    hint: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.surface,
      letterSpacing: 0.5,
    },
    motivationCard: {
      backgroundColor: isDark ? 'rgba(10, 132, 255, 0.08)' : 'rgba(0, 122, 255, 0.05)',
      padding: theme.spacing.lg,
      borderRadius: 16,
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    motivationText: {
      fontSize: 15,
      color: theme.colors.text,
      lineHeight: 22,
      fontStyle: 'italic',
    },
  });

  if (!isAuthenticated || isJobApplied(job.id)) {
    return null;
  }

  const progress = calculateProgress();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.headerCard}>
            <View style={styles.headerTop}>
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
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle} numberOfLines={2}>
                  {job.title}
                </Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
              </View>
            </View>
            <View style={styles.salaryBadge}>
              <Text style={styles.salaryIcon}>💰</Text>
              <Text style={styles.jobSalary}>{job.salary}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            ✨ Take your time to craft a thoughtful application. Show them why you're the perfect fit!
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📝</Text>
          <Text style={styles.sectionTitle}>Your Information</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              style={[
                styles.input,
                focusedField === 'name' && styles.inputFocused,
                errors.name && styles.inputError,
              ]}
              autoCapitalize="words"
            />
            {name.length > 1 && !errors.name && (
              <Text style={styles.inputIcon}>✓</Text>
            )}
          </View>
          {errors.name ? (
            <Text style={styles.errorText}>⚠️ {errors.name}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email Address <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="your.email@example.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused,
                errors.email && styles.inputError,
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {validateEmail(email) && !errors.email && (
              <Text style={styles.inputIcon}>✓</Text>
            )}
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>⚠️ {errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Contact Number <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={theme.colors.textSecondary}
              value={contactNumber}
              onChangeText={setContactNumber}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              style={[
                styles.input,
                focusedField === 'phone' && styles.inputFocused,
                errors.contactNumber && styles.inputError,
              ]}
              keyboardType="phone-pad"
            />
            {validatePhone(contactNumber) && !errors.contactNumber && (
              <Text style={styles.inputIcon}>✓</Text>
            )}
          </View>
          {errors.contactNumber ? (
            <Text style={styles.errorText}>⚠️ {errors.contactNumber}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Why should we hire you? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Share your passion, relevant experience, and what makes you a great fit for this role..."
            placeholderTextColor={theme.colors.textSecondary}
            value={reason}
            onChangeText={setReason}
            onFocus={() => setFocusedField('reason')}
            onBlur={() => setFocusedField(null)}
            style={[
              styles.input,
              styles.textArea,
              focusedField === 'reason' && styles.inputFocused,
              errors.reason && styles.inputError,
            ]}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <View style={styles.charCounter}>
            <Text style={styles.hint}>💡 Highlight your key achievements</Text>
            <Text
              style={[
                styles.charCount,
                reason.length >= 20 && styles.charCountGood,
              ]}
            >
              {reason.length} / 20 min
            </Text>
          </View>
          {errors.reason ? (
            <Text style={styles.errorText}>⚠️ {errors.reason}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            Submit Application 🚀
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};