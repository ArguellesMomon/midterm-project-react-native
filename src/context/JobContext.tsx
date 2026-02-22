import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job, Application } from '../types';

interface SavedJobEntry {
  userId: string;
  job: Job;
}

interface JobContextProps {
  jobs: Job[];
  savedJobs: Job[];
  applications: Application[];
  addJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  applyJob: (application: Omit<Application, 'id' | 'appliedAt'>) => void;
  removeApplication: (applicationId: string) => void;
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
  const [allSavedJobs, setAllSavedJobs] = useState<SavedJobEntry[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter saved jobs by current user
  const savedJobs = allSavedJobs
    .filter(entry => {
      // Only show jobs if user is logged in AND it's their job
      if (!currentUserId) return false;
      return entry.userId === currentUserId;
    })
    .map(entry => entry.job);

  // Filter applications by current user
  const applications = allApplications.filter(app => {
    if (!app || !app.userId) return false;
    if (!currentUserId) return false;
    return app.userId === currentUserId;
  });

  // Load saved jobs and applications from storage on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save to storage whenever allSavedJobs changes
  useEffect(() => {
    saveSavedJobs();
  }, [allSavedJobs]);

  // Save to storage whenever allApplications changes
  useEffect(() => {
    saveApplications();
  }, [allApplications]);

  // Sync saved jobs with current jobs data to update logos and other fields
  useEffect(() => {
    if (jobs.length > 0 && allSavedJobs.length > 0) {
      syncSavedJobsWithCurrentData();
    }
  }, [jobs]);

  const syncSavedJobsWithCurrentData = () => {
    const updatedSavedJobs = allSavedJobs.map(entry => {
      const currentJob = jobs.find(j => j.id === entry.job.id);
      return currentJob ? { ...entry, job: currentJob } : entry;
    });

    const hasChanges = updatedSavedJobs.some((entry, index) => {
      const saved = allSavedJobs[index];
      if (!saved) return true;
      return entry.job.companyLogo !== saved.job.companyLogo || 
             entry.job.salary !== saved.job.salary ||
             entry.job.description !== saved.job.description;
    });

    if (hasChanges) {
      console.log('Syncing saved jobs with fresh data...');
      setAllSavedJobs(updatedSavedJobs);
    }
  };

  const loadSavedData = async () => {
    try {
      // Load saved jobs
      const savedJobsData = await AsyncStorage.getItem(SAVED_JOBS_KEY);
      if (savedJobsData) {
        const parsed = JSON.parse(savedJobsData);
        
        // Migrate old format (array of jobs) to new format (array of entries)
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].userId) {
            // New format
            setAllSavedJobs(parsed);
          } else {
            // Old format - migrate to legacy user
            const migrated: SavedJobEntry[] = parsed.map((job: Job) => ({
              userId: 'legacy-user',
              job: job,
            }));
            setAllSavedJobs(migrated);
          }
        }
      }

      // Load all applications
      const applicationsData = await AsyncStorage.getItem(APPLICATIONS_KEY);
      if (applicationsData) {
        const apps = JSON.parse(applicationsData);
        
        // Migrate old applications without userId
        const migratedApps = apps.map((app: any) => {
          if (!app.userId) {
            return {
              ...app,
              userId: 'legacy-user',
            };
          }
          return app;
        });
        
        setAllApplications(migratedApps);
      }
      
      // Mark initial load as complete
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error loading saved data:', error);
      setIsInitialLoad(false);
    }
  };

  const saveSavedJobs = async () => {
    // Don't save during initial load
    if (isInitialLoad) return;
    
    try {
      await AsyncStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(allSavedJobs));
    } catch (error) {
      console.error('Error saving jobs:', error);
    }
  };

  const saveApplications = async () => {
    // Don't save during initial load
    if (isInitialLoad) return;
    
    try {
      await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(allApplications));
    } catch (error) {
      console.error('Error saving applications:', error);
    }
  };

  const addJob = (job: Job) => {
    if (!currentUserId) return;
    
    // Check if job is already saved by this user
    const alreadySaved = allSavedJobs.some(
      entry => entry.userId === currentUserId && entry.job.id === job.id
    );
    
    if (!alreadySaved) {
      setAllSavedJobs(prev => [...prev, { userId: currentUserId, job }]);
    }
  };

  const removeJob = (jobId: string) => {
    if (!currentUserId) return;
    
    setAllSavedJobs(prev => 
      prev.filter(entry => !(entry.userId === currentUserId && entry.job.id === jobId))
    );
  };

  const applyJob = (application: Omit<Application, 'id' | 'appliedAt'>) => {
    const newApplication: Application = {
      ...application,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appliedAt: new Date().toISOString(),
    };
    setAllApplications(prev => [...prev, newApplication]);
  };

  const removeApplication = (applicationId: string) => {
    if (!currentUserId) return;
    
    setAllApplications(prev => 
      prev.filter(app => !(app.id === applicationId && app.userId === currentUserId))
    );
  };

  const isJobSaved = (jobId: string) => {
    if (!currentUserId) return false;
    return allSavedJobs.some(
      entry => entry.userId === currentUserId && entry.job.id === jobId
    );
  };

  const isJobApplied = (jobId: string) => {
    if (!currentUserId) return false;
    return applications.some(app => app.jobId === jobId);
  };

  const clearApplications = () => {
    setAllApplications([]);
  };

  const clearSavedJobs = () => {
    // Don't actually clear from storage, just reset the view
    // Jobs will be filtered by user automatically
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        savedJobs,
        applications,
        addJob,
        removeJob,
        applyJob,
        removeApplication,
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