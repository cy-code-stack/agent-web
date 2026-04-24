import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import { Bell, Users, ShoppingCart, Calendar, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PageProps, AppNotification } from '@/types';

const STORAGE_KEY = 'marrea_notifications_read_at';

function timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

const typeIcon: Record<AppNotification['type'], React.ReactNode> = {
    client:      <Users className="h-3.5 w-3.5" />,
    sale:        <ShoppingCart className="h-3.5 w-3.5" />,
    appointment: <Calendar className="h-3.5 w-3.5" />,
};

const typeBg: Record<AppNotification['type'], string> = {
    client:      'bg-blue-100 text-blue-700',
    sale:        'bg-emerald-100 text-emerald-700',
    appointment: 'bg-violet-100 text-violet-700',
};

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < 640 : false,
    );
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 639px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

function NotificationPanel({
    notifications,
    unread,
    readAt,
    isMobile,
    onClose,
    onMarkRead,
    onNotificationClick,
}: {
    notifications: AppNotification[];
    unread: number;
    readAt: number;
    isMobile: boolean;
    onClose: () => void;
    onMarkRead: () => void;
    onNotificationClick: (href: string) => void;
}) {
    const panelContent = (
        <>
            {/* Drag handle (mobile only) */}
            {isMobile && (
                <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-muted-foreground/25" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">Notifications</span>
                    {unread > 0 && (
                        <span className="rounded-full bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 leading-none">
                            {unread} new
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {unread > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                            onClick={onMarkRead}
                        >
                            <CheckCheck className="h-3 w-3" />
                            Mark read
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={onClose}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className={cn(
                'overflow-y-auto overscroll-contain',
                isMobile ? 'max-h-[60vh]' : 'max-h-[calc(100vh-200px)]',
            )}>
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <Bell className="h-8 w-8 text-muted-foreground/30 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">New clients, sales, and appointments will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {notifications.map((n) => {
                            const isUnread = new Date(n.created_at).getTime() > readAt;
                            return (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => onNotificationClick(n.href)}
                                    className={cn(
                                        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
                                        'hover:bg-accent/5 active:bg-accent/10 focus-visible:outline-none focus-visible:bg-accent/10',
                                        isUnread && 'bg-primary/3',
                                    )}
                                >
                                    <div className={cn('flex-shrink-0 mt-0.5 rounded-full p-1.5', typeBg[n.type])}>
                                        {typeIcon[n.type]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-semibold">{n.title}</span>
                                            {isUnread && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-snug mt-0.5 truncate">
                                            {n.message}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60 flex-shrink-0 mt-0.5">
                                        {timeAgo(n.created_at)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="border-t border-border/50 px-4 py-2.5 bg-muted/20">
                    <p className="text-[11px] text-muted-foreground/70 text-center">
                        Showing activity from the last 7 days
                    </p>
                </div>
            )}
        </>
    );

    if (isMobile) {
        return createPortal(
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 z-40 bg-black/40 animate-in fade-in duration-200"
                    onClick={onClose}
                />
                {/* Bottom sheet */}
                <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border/50 bg-background/98 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out">
                    {panelContent}
                    {/* Safe-area spacer for notched phones */}
                    <div className="h-[env(safe-area-inset-bottom,0px)]" />
                </div>
            </>,
            document.body,
        );
    }

    return (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {panelContent}
        </div>
    );
}

export function NotificationBell() {
    const { notifications } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const [readAt, setReadAt] = useState<number>(() => {
        try {
            return parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
        } catch {
            return 0;
        }
    });
    const panelRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const unread = notifications.filter(
        (n) => new Date(n.created_at).getTime() > readAt,
    ).length;

    function markAllRead() {
        const now = Date.now();
        setReadAt(now);
        try {
            localStorage.setItem(STORAGE_KEY, String(now));
        } catch {}
    }

    // Lock body scroll on mobile when sheet is open
    useEffect(() => {
        if (isMobile && open) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isMobile, open]);

    useEffect(() => {
        if (!open || isMobile) return;
        function onClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [open, isMobile]);

    function handleNotificationClick(href: string) {
        setOpen(false);
        router.get(href);
    }

    return (
        <div className="relative" ref={panelRef}>
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    'relative h-9 w-9 rounded-full transition-all duration-200',
                    'hover:bg-accent/50',
                    open && 'bg-accent/50',
                )}
                onClick={() => setOpen((v) => !v)}
                aria-label="Notifications"
            >
                <Bell className={cn('h-4.5 w-4.5 transition-transform duration-300', unread > 0 && 'animate-[wiggle_0.5s_ease-in-out]')} />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </Button>

            {open && (
                <NotificationPanel
                    notifications={notifications}
                    unread={unread}
                    readAt={readAt}
                    isMobile={isMobile}
                    onClose={() => setOpen(false)}
                    onMarkRead={markAllRead}
                    onNotificationClick={handleNotificationClick}
                />
            )}
        </div>
    );
}
