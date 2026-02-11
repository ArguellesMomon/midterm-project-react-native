import { Job } from '../types';

const formatSalary = (
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined
): string => {
  // Check if we have any salary data
  const hasMin = min !== null && min !== undefined && min > 0;
  const hasMax = max !== null && max !== undefined && max > 0;
  
  if (!hasMin && !hasMax) {
    return 'Salary not specified';
  }
  
  // Use the currency or default to empty string
  const curr = currency || '';
  const separator = curr ? ' ' : '';
  
  // Both min and max available
  if (hasMin && hasMax) {
    return `${curr}${separator}${min.toLocaleString()} - ${max.toLocaleString()}`;
  }
  
  // Only min available
  if (hasMin) {
    return `${curr}${separator}${min.toLocaleString()}+`;
  }
  
  // Only max available
  if (hasMax) {
    return `Up to ${curr}${separator}${max.toLocaleString()}`;
  }
  
  return 'Salary not specified';
};

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch('https://empllo.com/api/v1');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data || !Array.isArray(data.jobs)) {
      console.error('Invalid API response structure:', data);
      return [];
    }

    const jobsArray = data.jobs;

    return jobsArray.map((job: any, index: number) => {
      // Handle locations
      const location = Array.isArray(job.locations) && job.locations.length > 0
        ? job.locations.join(', ')
        : 'Remote';

      // Create stable ID
      let stableId: string;
      if (job.url && typeof job.url === 'string' && job.url.trim() !== '') {
        try {
          stableId = `job-${btoa(job.url).replace(/[^a-zA-Z0-9]/g, '')}`;
        } catch (e) {
          // Fallback if btoa fails
          const uniqueKey = `${job.companyName || 'company'}-${job.title || 'title'}-${index}`
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
          stableId = `job-${uniqueKey}`;
        }
      } else {
        const uniqueKey = `${job.companyName || 'company'}-${job.title || 'title'}-${index}`
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        stableId = `job-${uniqueKey}`;
      }

      // Format salary
      const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);

      return {
        id: stableId,
        title: job.title || 'No Title',
        company: job.companyName || 'No Company',
        companyLogo: job.companyLogo || undefined,
        jobType: job.jobType || 'Not specified',
        workModel: job.workModel || 'Not specified',
        seniority: job.seniorityLevel || 'Not specified',
        salary: salary,
        location: location,
        tags: Array.isArray(job.tags) ? job.tags : [],
        applyUrl: job.url || '',
        source: 'Empllo' as const,
        description: `${job.title || 'Position'} role at ${job.companyName || 'Company'}. This is a ${job.jobType || 'full time'} ${job.workModel || 'remote'} position (${job.seniorityLevel || 'mid'} level) based in ${location}.`,
      };
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};