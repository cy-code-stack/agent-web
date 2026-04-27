import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, ShoppingCart, Wallet,
    Calendar, ChevronLeft, LogOut, UserCog,
} from 'lucide-react';
import { cn, generateInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/Layouts/AppLayout';
import { SIDEBAR_NAV_ITEMS } from '@/lib/constants';
import { router } from '@inertiajs/react';
import type { PageProps } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard, Users, ShoppingCart, Wallet, Calendar,
};

export function Sidebar() {
    const { url, props } = usePage<PageProps>();
    const { auth } = props;
    const { isCollapsed, toggleCollapse } = useSidebar();

    const user = auth.user;
    const initials = user ? generateInitials(user.name, '') : 'AG';
    const firstName = user?.name?.split(' ')[0] ?? 'Agent';

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    'hidden md:flex fixed inset-y-0 left-0 z-50 flex-col h-screen',
                    'bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95',
                    'border-r border-sidebar-border/50 shadow-xl shadow-black/10',
                    'transition-all duration-300 ease-in-out',
                    isCollapsed ? 'w-16' : 'w-64',
                )}
            >
                {/* Logo */}
                <div
                    className={cn(
                        'flex items-center h-16 px-4 border-b border-sidebar-border',
                        isCollapsed ? 'justify-center' : 'justify-between',
                    )}
                >
                    {!isCollapsed && (
                        <Link href="/dashboard" className="flex items-center">
                            <img
                                src="/images/marrea-dark.png"
                                alt="Marrea Estates Corporation"
                                className="h-10 w-auto"
                            />
                        </Link>
                    )}
                    {isCollapsed && (
                        <Link href="/dashboard" className="flex items-center justify-center">
                            <img
                                src="/images/marrea-dark.png"
                                alt="Marrea"
                                className="h-8 w-8 object-contain object-left"
                                style={{ objectPosition: 'left center', clipPath: 'inset(0 75% 0 0)' }}
                            />
                        </Link>
                    )}
                    {!isCollapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCollapse}
                            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2">
                    {!isCollapsed && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2">
                            Navigation
                        </p>
                    )}
                    <ul className="space-y-1">
                        {SIDEBAR_NAV_ITEMS.map((item) => {
                            const Icon = iconMap[item.icon];
                            const isActive = url === item.href || url.startsWith(`${item.href}/`);

                            return (
                                <li key={item.href}>
                                    {isCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        'group flex items-center justify-center h-11 w-full rounded-lg transition-all duration-200 relative overflow-hidden',
                                                        isActive
                                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                                                            : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="font-medium bg-sidebar text-sidebar-foreground border-sidebar-border">
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'group flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 relative overflow-hidden',
                                                isActive
                                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                                                    : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                                            )}
                                        >
                                            {isActive && (
                                                <span className="absolute inset-y-0 left-0 w-0.5 bg-sidebar-primary-foreground/50 rounded-full" />
                                            )}
                                            <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                            <span className="truncate font-medium">{item.title}</span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Agent profile section */}
                <div className="border-t border-sidebar-border">
                    {isCollapsed ? (
                        <div className="p-2 space-y-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/profile" className="flex items-center justify-center h-10 w-full rounded-lg hover:bg-sidebar-accent/50 transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                                    <p className="font-semibold">{user?.name ?? 'Agent'}</p>
                                    <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
                                    <p className="text-xs text-sidebar-foreground/40 mt-0.5">View profile</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleCollapse}
                                        className="w-full h-10 text-sidebar-foreground hover:bg-sidebar-accent"
                                    >
                                        <ChevronLeft className="h-4 w-4 rotate-180" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Expand sidebar</TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-sidebar-accent/40 hover:bg-sidebar-accent/60 transition-colors">
                                <Avatar className="h-9 w-9 flex-shrink-0">
                                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
                                        {firstName}
                                    </p>
                                    <p className="text-[11px] text-sidebar-foreground/50 truncate">
                                        Sales Agent
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="/profile"
                                                className="h-7 w-7 flex items-center justify-center text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                                            >
                                                <UserCog className="h-3.5 w-3.5" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">My Profile</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.post('/logout')}
                                                className="h-7 w-7 flex-shrink-0 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
                                            >
                                                <LogOut className="h-3.5 w-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Log out</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </TooltipProvider>
    );
}
