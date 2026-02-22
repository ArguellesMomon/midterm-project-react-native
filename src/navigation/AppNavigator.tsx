import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobFinderScreen } from '../screens/JobFinderScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { AppliedJobsScreen } from '../screens/AppliedJobsScreen';
import { ApplicationFormScreen } from '../screens/ApplicationFormScreen';
import { JobDetailsScreen } from '../screens/JobDetailsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { theme } = useThemeContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="JobFinder"
        component={JobFinderScreen}
        options={{
          title: 'Find Jobs',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedJobs"
        component={SavedJobsScreen}
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="bookmark" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AppliedJobs"
        component={AppliedJobsScreen}
        options={{
          title: 'Applied',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="briefcase" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Simple icon component using emoji
const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  const icons: { [key: string]: string } = {
    search: '🔍',
    bookmark: '📑',
    briefcase: '💼',
  };

  return (
    <Text style={{ fontSize: size }}>
      {icons[name]}
    </Text>
  );
};

export const AppNavigator = () => {
  const { theme } = useThemeContext();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: true,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {/* Main App - Always shows first */}
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      
      {/* Job Details Screen - Full screen modal */}
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{
          headerShown: true,
          title: 'Job Details',
          headerBackTitle: 'Back',
        }}
      />
      
      {/* Auth Screens - Modal style for login/register */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      
      {/* Application Form - Requires auth check */}
      <Stack.Screen
        name="ApplicationForm"
        component={ApplicationFormScreen}
        options={{
          headerShown: true,
          title: 'Apply for Job',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};