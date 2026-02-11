import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobContext } from '../context/JobContext';

export const AuthSync = () => {
  const { user } = useAuth();
  const { setCurrentUserId, clearSavedJobs } = useJobContext();

  useEffect(() => {
    if (user) {
      // User logged in - set user ID
      setCurrentUserId(user.id);
    } else {
      // User logged out - clear user ID and saved jobs
      setCurrentUserId(null);
      clearSavedJobs();
    }
  }, [user]);

  return null;
};