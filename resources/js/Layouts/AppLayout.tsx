import { ReactNode, useState, createContext, useContext } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Toaster } from '@/components/ui/sonner';
import { FlashToast } from '@/components/FlashToast';
import { cn } from '@/lib/utils';

interface SidebarContextValue {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    toggleCollapse: () => void;
    setMobileOpen: (open: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
    isCollapsed: false,
    isMobileOpen: false,
    toggleCollapse: () => {},
    setMobileOpen: () => {},
});

export function useSidebar() {
    return useContext(SidebarContext);
}

export default function AppLayout({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                isMobileOpen,
                toggleCollapse: () => setIsCollapsed((v) => !v),
                setMobileOpen: setIsMobileOpen,
            }}
        >
            <div className="min-h-screen bg-background">
                <Sidebar />
                <MobileNav />

                <div
                    className={cn(
                        'min-h-screen transition-all duration-300 ease-in-out',
                        'md:pl-64',
                        isCollapsed && 'md:pl-16',
                    )}
                >
                    <Header />
                    <main className="p-3 sm:p-5 md:p-6">{children}</main>
                </div>
            </div>

            <Toaster />
            <FlashToast />
        </SidebarContext.Provider>
    );
}
