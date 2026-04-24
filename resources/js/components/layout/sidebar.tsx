import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, ShoppingCart, Wallet,
    Calendar, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/Layouts/AppLayout';
import { SIDEBAR_NAV_ITEMS } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard, Users, ShoppingCart, Wallet, Calendar,
};

export function Sidebar() {
    const { url } = usePage();
    const { isCollapsed, toggleCollapse } = useSidebar();

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

                {/* Expand button (collapsed state) */}
                {isCollapsed && (
                    <div className="p-2 border-t border-sidebar-border">
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
                )}
            </aside>
        </TooltipProvider>
    );
}
