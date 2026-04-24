import { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, ShoppingCart, Wallet,
    Calendar, X, Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/Layouts/AppLayout';
import { SIDEBAR_NAV_ITEMS } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard, Users, ShoppingCart, Wallet, Calendar,
};

export function MobileNav() {
    const { url } = usePage();
    const { isMobileOpen, setMobileOpen } = useSidebar();

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

    if (!isMobileOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
            />
            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 w-72 md:hidden',
                'bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95',
                'border-r border-sidebar-border/50 shadow-2xl shadow-black/20',
                'animate-slide-in-from-left',
            )}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border/50">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 group"
                        onClick={() => setMobileOpen(false)}
                    >
                        <div className="p-1.5 rounded-lg bg-sidebar-primary/20 group-hover:bg-sidebar-primary/30 transition-colors">
                            <Building2 className="h-6 w-6 text-sidebar-primary" />
                        </div>
                        <span className="font-semibold text-lg text-sidebar-foreground">Agent Portal</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(false)}
                        className="h-9 w-9 rounded-lg text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <ul className="space-y-1.5">
                        {SIDEBAR_NAV_ITEMS.map((item, index) => {
                            const Icon = iconMap[item.icon];
                            const isActive = url === item.href || url.startsWith(`${item.href}/`);

                            return (
                                <li key={item.href} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'group flex items-center gap-3 h-12 px-4 rounded-xl transition-all duration-200 relative overflow-hidden',
                                            isActive
                                                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30'
                                                : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                        <span className="text-base font-medium">{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-sidebar-border/50">
                    <p className="text-xs text-sidebar-foreground/50 text-center">Marrea Estates Corporation</p>
                </div>
            </aside>
        </>
    );
}
