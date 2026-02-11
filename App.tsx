import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { JobProvider } from './src/context/JobContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthSync } from './src/components/AuthSync';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JobProvider>
                    <AuthSync />

          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </JobProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}