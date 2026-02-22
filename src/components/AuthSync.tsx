import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobContext } from '../context/JobContext';

export const AuthSync: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentUserId } = useJobContext();

  useEffect(() => {
    try {
      if (user && user.id) {
        // User logged in - set user ID
        setCurrentUserId(user.id);
      } else {
        // User logged out - clear user ID only
        // Saved jobs and applications stay in storage, just filtered out
        setCurrentUserId(null);
      }
    } catch (error) {
      console.error('AuthSync error:', error);
    }
  }, [user, setCurrentUserId]);

  return null;
};