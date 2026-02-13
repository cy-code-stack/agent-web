export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "agent" | "manager" | "admin";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

// Agent Types
export interface Agent {
  id: number;
  userId: number;
  realtyId?: number;
  managerId?: number;
  referralCode: string;
  appointmentRefCode: string;
  personalInfo: PersonalInfo;
  address: Address;
  contactInfo: ContactInfo;
  isInstitution: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: "male" | "female" | "other";
  pagIbigId?: string;
  tin?: string;
}

export interface Address {
  country?: string;
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
  street?: string;
  unit?: string;
  buildingName?: string;
  houseNo?: string;
  subdivision?: string;
  zipCode?: string;
}

export interface ContactInfo {
  phone?: string;
  landline?: string;
  email: string;
}

// Client/Buyer Types
export interface Client {
  id: number;
  userId?: number;
  buyerType: "principal-buyer" | "co-buyer";
  personalInfo: BuyerPersonalInfo;
  contactInfo: ContactInfo;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerPersonalInfo extends PersonalInfo {
  birthDate?: string;
  nationality?: string;
  civilStatus?: "single" | "married" | "widowed" | "divorced";
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalClients: number;
  totalSales: number;
  pendingIncentives: number;
  upcomingAppointments: number;
  recentActivity: ActivityItem[];
  salesSummary: SalesSummary;
}

export interface ActivityItem {
  id: number;
  type: "sale" | "client" | "incentive" | "appointment";
  title: string;
  description: string;
  timestamp: string;
}

export interface SalesSummary {
  totalAmount: number;
  monthlyTarget: number;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
}

// Incentive Types
export interface Incentive {
  id: number;
  agentId: number;
  saleId: number;
  unitId: number;
  totalIncentive: number;
  status: IncentiveStatus;
  dateNeeded?: string;
  remarks?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type IncentiveStatus = "pending" | "approved" | "rejected" | "paid";

// Unit Types
export interface Unit {
  id: number;
  projectId: number;
  projectName: string;
  unitName: string;
  unitType: UnitType;
  floorArea: number;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  status: UnitStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type UnitType = "studio" | "1br" | "2br" | "3br" | "loft" | "penthouse";

export type UnitStatus = "available" | "reserved" | "sold";

// Appointment Types
export interface Appointment {
  id: number;
  agentId: number;
  clientId: number;
  projectId: number;
  scheduledDate: string;
  scheduledTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Form Types
export interface SelectOption {
  label: string;
  value: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
  badge?: string | number;
}

// Notification Types
export type NotificationType = "sale" | "client" | "incentive" | "appointment" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
