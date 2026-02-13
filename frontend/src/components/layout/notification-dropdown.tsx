"use client";

import { useState, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNotificationStore } from "@/lib/store";
import { useIsMobile, useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const typeStyles: Record<NotificationType, string> = {
  sale: "bg-green-500",
  client: "bg-blue-500",
  incentive: "bg-amber-500",
  appointment: "bg-purple-500",
  system: "bg-slate-500",
};

const typeLabels: Record<NotificationType, string> = {
  sale: "Sale",
  client: "Client",
  incentive: "Incentive",
  appointment: "Appointment",
  system: "System",
};

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function NotificationItem({
  notification,
  onMarkRead,
  onRemove,
  onClick,
  isMobile,
}: {
  notification: Notification;
  onMarkRead: () => void;
  onRemove: () => void;
  onClick: () => void;
  isMobile: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-lg cursor-pointer transition-colors",
        isMobile ? "p-4 active:bg-accent/60" : "p-3",
        notification.read
          ? "bg-transparent hover:bg-accent/50"
          : "bg-accent/30 hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      {/* Type indicator */}
      <div
        className={cn(
          "mt-1.5 h-2.5 w-2.5 rounded-full shrink-0",
          typeStyles[notification.type]
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0 pr-16">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium",
              isMobile ? "text-base" : "text-sm",
              !notification.read && "text-foreground"
            )}
          >
            {notification.title}
          </p>
        </div>
        <p
          className={cn(
            "text-muted-foreground mt-1 line-clamp-2",
            isMobile ? "text-sm" : "text-xs"
          )}
        >
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "inline-block font-medium px-1.5 py-0.5 rounded",
              "bg-muted text-muted-foreground",
              isMobile ? "text-xs" : "text-[10px]"
            )}
          >
            {typeLabels[notification.type]}
          </span>
          <span
            className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-[10px]"
            )}
          >
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>
      </div>

      {/* Actions - always visible on mobile, hover on desktop */}
      <div
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 transition-opacity",
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-muted-foreground hover:text-foreground",
              isMobile ? "h-9 w-9" : "h-7 w-7"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead();
            }}
            aria-label="Mark as read"
          >
            <Check className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-muted-foreground hover:text-destructive",
            isMobile ? "h-9 w-9" : "h-7 w-7"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove notification"
        >
          <X className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        </Button>
      </div>
    </div>
  );
}

function NotificationList({
  isMobile,
  onClose,
}: {
  isMobile: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationStore();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      onClose?.();
      router.push(notification.actionUrl);
    }
  };

  return (
    <>
      {/* Header - only shown in dropdown mode */}
      {!isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({unreadCount} unread)
              </span>
            )}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-primary hover:text-primary"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
      )}

      {/* Mobile header actions */}
      {isMobile && unreadCount > 0 && (
        <div className="flex justify-end px-2 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-primary hover:text-primary"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
      )}

      {/* Notification list */}
      <div
        className={cn(
          "overflow-y-auto",
          isMobile ? "flex-1 -mx-6 px-4" : "max-h-[400px]"
        )}
      >
        {notifications.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center text-muted-foreground",
              isMobile ? "py-16" : "py-8"
            )}
          >
            <Bell className={cn("mb-3 opacity-50", isMobile ? "h-12 w-12" : "h-10 w-10")} />
            <p className={isMobile ? "text-base" : "text-sm"}>No notifications</p>
          </div>
        ) : (
          <div className={cn("space-y-1", !isMobile && "p-2")}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={() => markAsRead(notification.id)}
                onRemove={() => removeNotification(notification.id)}
                onClick={() => handleNotificationClick(notification)}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          {!isMobile && <DropdownMenuSeparator className="bg-border/50" />}
          <div className={cn(isMobile ? "pt-4 border-t border-border/50 -mx-6 px-6" : "p-2")}>
            <Button
              variant={isMobile ? "outline" : "ghost"}
              className={cn(
                "w-full justify-center",
                isMobile
                  ? "h-12 text-base"
                  : "text-sm text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                onClose?.();
                router.push("/notifications");
              }}
            >
              View all notifications
            </Button>
          </div>
        </>
      )}
    </>
  );
}

const NotificationTrigger = forwardRef<
  HTMLButtonElement,
  { unreadCount: number }
>(({ unreadCount, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className="relative hover:bg-accent/50 transition-all duration-200 hover:scale-105"
    aria-label="Notifications"
    {...props}
  >
    <Bell className="h-5 w-5" />
    {unreadCount > 0 && (
      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center">
        <span className="absolute h-full w-full rounded-full bg-destructive animate-ping opacity-75" />
        <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      </span>
    )}
  </Button>
));
NotificationTrigger.displayName = "NotificationTrigger";

export function NotificationDropdown() {
  const mounted = useMounted();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { unreadCount } = useNotificationStore();

  // Render just the trigger button until mounted to avoid hydration mismatch
  if (!mounted) {
    return <NotificationTrigger unreadCount={unreadCount} />;
  }

  // Mobile: Use Sheet (bottom drawer)
  if (isMobile) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <NotificationTrigger unreadCount={unreadCount} />
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-xl">
          <SheetHeader className="text-left pb-2">
            <SheetTitle className="text-xl">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({unreadCount} unread)
                </span>
              )}
            </SheetTitle>
          </SheetHeader>
          <NotificationList isMobile onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NotificationTrigger unreadCount={unreadCount} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 p-0 shadow-lg border-border/50 bg-background/95 backdrop-blur-xl"
      >
        <NotificationList isMobile={false} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
