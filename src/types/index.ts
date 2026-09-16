export interface EmployeeData {
  firstName: string;
  lastName: string;
  employeeId: string;
  profilePicture?: string;
  jobTitle?: string;
  employmentStatus?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiEmployee {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  jobTitle?: string;
  employmentStatus?: string;
}

export interface TestConfig {
  baseURL: string;
  apiBaseURL: string;
  timeout: number;
  retries: number;
}