import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
}

type NotificationStore = NotificationState & NotificationActions;

// Dummy notifications for development
const dummyNotifications: Notification[] = [
  {
    id: "1",
    type: "sale",
    title: "New Sale Recorded",
    message: "Unit 2B at Sunrise Residences has been reserved by Maria Santos.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    read: false,
    actionUrl: "/sales",
  },
  {
    id: "2",
    type: "incentive",
    title: "Incentive Approved",
    message: "Your incentive request for Unit 15A has been approved. Amount: PHP 45,000",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    actionUrl: "/incentives",
  },
  {
    id: "3",
    type: "appointment",
    title: "Upcoming Site Visit",
    message: "Reminder: Site visit with John Reyes at Marina Heights tomorrow at 2:00 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: false,
    actionUrl: "/appointments",
  },
  {
    id: "4",
    type: "client",
    title: "New Client Registered",
    message: "Ana Garcia has registered through your referral link.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true,
    actionUrl: "/clients",
  },
  {
    id: "5",
    type: "system",
    title: "Commission Rate Updated",
    message: "The commission rate for premium units has been updated to 3.5%",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
];

const calculateUnreadCount = (notifications: Notification[]): number =>
  notifications.filter((n) => !n.read).length;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: dummyNotifications,
  unreadCount: calculateUnreadCount(dummyNotifications),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      const notifications = [newNotification, ...state.notifications];
      return {
        notifications,
        unreadCount: calculateUnreadCount(notifications),
      };
    }),
}));
