export const APP_NAME = "Agent Interface";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  CLIENTS: "/clients",
  CLIENT_DETAILS: (id: string) => `/clients/${id}`,
  SALES: "/sales",
  SALE_DETAILS: (id: string) => `/sales/${id}`,
  INCENTIVES: "/incentives",
  INCENTIVE_DETAILS: (id: string) => `/incentives/${id}`,
  APPOINTMENTS: "/appointments",
  APPOINTMENT_DETAILS: (id: string) => `/appointments/${id}`,
  UNITS: "/units",
  UNIT_DETAILS: (id: string) => `/units/${id}`,
} as const;

export const SIDEBAR_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    title: "Clients",
    href: ROUTES.CLIENTS,
    icon: "Users",
  },
  {
    title: "Sales",
    href: ROUTES.SALES,
    icon: "ShoppingCart",
  },
  {
    title: "Incentives",
    href: ROUTES.INCENTIVES,
    icon: "Wallet",
  },
  {
    title: "Appointments",
    href: ROUTES.APPOINTMENTS,
    icon: "Calendar",
  },
  {
    title: "Units",
    href: ROUTES.UNITS,
    icon: "Building",
  },
] as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
