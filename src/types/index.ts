export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  jobType?: string;
  workModel?: string;
  seniority?: string;
  salary: string;
  location?: string;
  tags?: string[];
  applyUrl?: string;
  source?: string;
  description: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  status: string;
  userId: string;
  appliedAt: string;
}

export interface Theme {
  colors: {
    primary: string;
    primaryDark?: string;
    primaryLight?: string;
    secondary: string;
    background: string;
    backgroundGradientStart?: string;
    backgroundGradientEnd?: string;
    surface: string;
    surfaceElevated?: string;
    text: string;
    textSecondary: string;
    textTertiary?: string;
    border: string;
    borderLight?: string;
    success: string;
    successLight?: string;
    error: string;
    errorLight?: string;
    warning: string;
    warningLight?: string;
    info?: string;
    infoLight?: string;
    cardGradientStart?: string;
    cardGradientEnd?: string;
    accent?: string;
    accentLight?: string;
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