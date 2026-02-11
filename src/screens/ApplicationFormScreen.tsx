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
} from 'react-native';
import { useJobContext } from '../context/JobContext';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const ApplicationFormScreen = ({ route, navigation }: any) => {
  const { job } = route.params;
  const { applyJob, isJobApplied } = useJobContext();
  const { theme } = useThemeContext();
  const { isAuthenticated, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    reason: '',
  });

  // Check authentication on mount
  useEffect(() => {
    // Check if already applied
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
    } else {
      // Pre-fill with user data if authenticated
      if (user?.name) setName(user.name);
      if (user?.email) setEmail(user.email);
    }
  }, [isAuthenticated]);

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

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate contact number
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!validatePhone(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    // Validate reason
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
    // Double-check authentication before submitting
    if (!isAuthenticated) {
      Alert.alert('Error', 'You must be logged in to apply');
      navigation.replace('Login');
      return;
    }

    // Check if already applied (double-check)
    if (isJobApplied(job.id)) {
      Alert.alert(
        'Already Applied',
        'You have already submitted an application for this job.',
        [
          {
            text: 'View Applications',
            onPress: () => navigation.navigate('Main', { screen: 'AppliedJobs' }),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    // Save application with job details
    applyJob({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status: 'pending',
      userId: user?.id || '',
    });

    Alert.alert(
      'Success! 🎉',
      `Your application for ${job.title} at ${job.company} has been submitted!`,
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

    // Clear form
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
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
    },
    jobInfo: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 12,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    jobTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    jobCompany: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    jobSalary: {
      fontSize: 15,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    section: {
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
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    inputError: {
      borderColor: theme.colors.error || '#FF3B30',
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    errorText: {
      color: theme.colors.error || '#FF3B30',
      fontSize: 13,
      marginBottom: theme.spacing.sm,
    },
    charCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'right',
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 17,
      fontWeight: '600',
    },
  });

  // If not authenticated or already applied, return null (alert will handle navigation)
  if (!isAuthenticated || isJobApplied(job.id)) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCompany}>{job.company}</Text>
          <Text style={styles.jobSalary}>{job.salary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={[styles.input, errors.name ? styles.inputError : null]}
            autoCapitalize="words"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Email Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="your.email@example.com"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, errors.email ? styles.inputError : null]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Contact Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="+1 (555) 123-4567"
            placeholderTextColor={theme.colors.textSecondary}
            value={contactNumber}
            onChangeText={setContactNumber}
            style={[styles.input, errors.contactNumber ? styles.inputError : null]}
            keyboardType="phone-pad"
          />
          {errors.contactNumber ? (
            <Text style={styles.errorText}>{errors.contactNumber}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Why should we hire you? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Tell us about your relevant experience and why you're a great fit for this role..."
            placeholderTextColor={theme.colors.textSecondary}
            value={reason}
            onChangeText={setReason}
            style={[
              styles.input,
              styles.textArea,
              errors.reason ? styles.inputError : null,
            ]}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{reason.length} characters</Text>
          {errors.reason ? <Text style={styles.errorText}>{errors.reason}</Text> : null}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};