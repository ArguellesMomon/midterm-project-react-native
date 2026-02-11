export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  jobType: string;
  workModel: string;
  seniority: string;
  salary: string;
  location: string;
  tags: string[];
  description: string;
  applyUrl: string;
  source: 'Empllo';
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  userId: string;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}