import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job, Application } from '../types';

// Note: We can't import useAuth here due to circular dependency
// We'll pass userId through the applyJob function instead

interface JobContextProps {
  jobs: Job[];
  savedJobs: Job[];
  applications: Application[];
  addJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  applyJob: (application: Omit<Application, 'id' | 'appliedAt'>) => void;
  setJobs: (jobs: Job[]) => void;
  isJobSaved: (jobId: string) => boolean;
  isJobApplied: (jobId: string) => boolean;
  clearApplications: () => void;
  clearSavedJobs: () => void;
  setCurrentUserId: (userId: string | null) => void;
}

const JobContext = createContext<JobContextProps>({} as JobContextProps);

const SAVED_JOBS_KEY = '@job_finder_saved_jobs';
const APPLICATIONS_KEY = '@job_finder_applications';

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Filter applications by current user
  const applications = allApplications.filter(app => {
    // Safety check - ensure app has required fields
    if (!app || !app.userId) return false;
    // Only show apps if user is logged in AND it's their app
    if (!currentUserId) return false;
    return app.userId === currentUserId;
  });

  // Load saved jobs and applications from storage on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save to storage whenever savedJobs changes
  useEffect(() => {
    saveSavedJobs();
  }, [savedJobs]);

  // Save to storage whenever allApplications changes
  useEffect(() => {
    saveApplications();
  }, [allApplications]);

  // Listen for storage changes (e.g., when user logs out)
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      try {
        const storedApps = await AsyncStorage.getItem(APPLICATIONS_KEY);
        const apps = storedApps ? JSON.parse(storedApps) : [];
        
        // Only update if different
        if (JSON.stringify(apps) !== JSON.stringify(allApplications)) {
          setAllApplications(apps);
        }
      } catch (error) {
        // Ignore errors
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(checkInterval);
  }, [allApplications]);

  // Sync saved jobs with current jobs data to update logos and other fields
  useEffect(() => {
    if (jobs.length > 0 && savedJobs.length > 0) {
      syncSavedJobsWithCurrentData();
    }
  }, [jobs]); // Only depend on jobs, not savedJobs

  const syncSavedJobsWithCurrentData = () => {
    const updatedSavedJobs = savedJobs.map(savedJob => {
      // Find the matching job in current jobs list
      const currentJob = jobs.find(j => j.id === savedJob.id);
      
      // If found, use the current job data (which has logo and latest info)
      // Otherwise keep the saved job as is
      return currentJob || savedJob;
    });

    // Only update if there are actual changes
    const hasChanges = updatedSavedJobs.some((job, index) => {
      const saved = savedJobs[index];
      if (!saved) return true;
      return job.companyLogo !== saved.companyLogo || 
             job.salary !== saved.salary ||
             job.description !== saved.description;
    });

    if (hasChanges) {
      console.log('Syncing saved jobs with fresh data...');
      setSavedJobs(updatedSavedJobs);
    }
  };

  const loadSavedData = async () => {
    try {
      // Load saved jobs
      const savedJobsData = await AsyncStorage.getItem(SAVED_JOBS_KEY);
      if (savedJobsData) {
        setSavedJobs(JSON.parse(savedJobsData));
      }

      // Load all applications (will be filtered by user)
      const applicationsData = await AsyncStorage.getItem(APPLICATIONS_KEY);
      if (applicationsData) {
        const apps = JSON.parse(applicationsData);
        
        // Migrate old applications without userId
        const migratedApps = apps.map((app: any) => {
          if (!app.userId) {
            return {
              ...app,
              userId: 'legacy-user', // Assign to legacy user
            };
          }
          return app;
        });
        
        setAllApplications(migratedApps);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveSavedJobs = async () => {
    try {
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
    } catch (error) {
      console.error('Error saving jobs:', error);
    }
  };

  const saveApplications = async () => {
    try {
      await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(allApplications));
    } catch (error) {
      console.error('Error saving applications:', error);
    }
  };

  const addJob = (job: Job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs(prev => [...prev, job]);
    }
  };

  const removeJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const applyJob = (application: Omit<Application, 'id' | 'appliedAt'>) => {
    const newApplication: Application = {
      ...application,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appliedAt: new Date().toISOString(),
    };
    setAllApplications(prev => [...prev, newApplication]);
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some(j => j.id === jobId);
  };

  const isJobApplied = (jobId: string) => {
    // If no user is logged in, no jobs are applied
    if (!currentUserId) return false;
    return applications.some(app => app.jobId === jobId);
  };

  const clearApplications = () => {
    setAllApplications([]);
  };

  const clearSavedJobs = () => {
    setSavedJobs([]);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        savedJobs,
        applications, // This is the filtered list
        addJob,
        removeJob,
        applyJob,
        setJobs,
        isJobSaved,
        isJobApplied,
        clearApplications,
        clearSavedJobs,
        setCurrentUserId,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};