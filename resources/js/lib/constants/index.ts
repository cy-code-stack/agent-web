import { NavItem } from '@/types';

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { title: 'Clients', href: '/clients', icon: 'Users' },
    { title: 'Sales', href: '/sales', icon: 'ShoppingCart' },
    { title: 'Incentives', href: '/incentives', icon: 'Wallet' },
    { title: 'Appointments', href: '/appointments', icon: 'Calendar' },
];

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;
