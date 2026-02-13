"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/constants";
import type { AppointmentStatus } from "@/types";

const mockAppointments = [
  {
    id: 1,
    clientName: "Juan Dela Cruz",
    clientPhone: "+63 917 123 4567",
    projectName: "Marina Heights Tower 1",
    location: "Pasay City, Metro Manila",
    scheduledDate: "2024-02-05T10:00:00Z",
    status: "scheduled" as AppointmentStatus,
    notes: "First-time buyer, interested in 1BR units",
    createdAt: "2024-01-28T00:00:00Z",
  },
  {
    id: 2,
    clientName: "Maria Santos",
    clientPhone: "+63 918 234 5678",
    projectName: "Parkview Residences",
    location: "Makati City, Metro Manila",
    scheduledDate: "2024-02-06T14:00:00Z",
    status: "confirmed" as AppointmentStatus,
    notes: "Upgrading from condo, looking for 2BR",
    createdAt: "2024-01-29T00:00:00Z",
  },
  {
    id: 3,
    clientName: "Pedro Reyes",
    clientPhone: "+63 919 345 6789",
    projectName: "Skyline Condos",
    location: "Taguig City, Metro Manila",
    scheduledDate: "2024-02-04T09:00:00Z",
    status: "completed" as AppointmentStatus,
    notes: "Investment buyer, considering multiple units",
    createdAt: "2024-01-25T00:00:00Z",
  },
  {
    id: 4,
    clientName: "Ana Garcia",
    clientPhone: "+63 920 456 7890",
    projectName: "Greenfield Estates",
    location: "Laguna",
    scheduledDate: "2024-02-03T11:00:00Z",
    status: "cancelled" as AppointmentStatus,
    notes: "Rescheduled due to client conflict",
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 5,
    clientName: "Carlos Mendoza",
    clientPhone: "+63 921 567 8901",
    projectName: "Sunset Villas",
    location: "Cavite",
    scheduledDate: "2024-02-07T15:30:00Z",
    status: "scheduled" as AppointmentStatus,
    notes: "Looking for vacation home",
    createdAt: "2024-01-30T00:00:00Z",
  },
  {
    id: 6,
    clientName: "Elena Cruz",
    clientPhone: "+63 922 678 9012",
    projectName: "Marina Heights Tower 2",
    location: "Pasay City, Metro Manila",
    scheduledDate: "2024-02-08T10:30:00Z",
    status: "confirmed" as AppointmentStatus,
    notes: "Returning client, interested in studio units",
    createdAt: "2024-01-31T00:00:00Z",
  },
];

type FilterStatus = "all" | AppointmentStatus;

const statusConfig: Record<
  AppointmentStatus,
  {
    variant: "warning" | "info" | "success" | "destructive" | "secondary";
    label: string;
    icon: typeof Clock;
  }
> = {
  scheduled: { variant: "warning", label: "Scheduled", icon: Clock },
  confirmed: { variant: "info", label: "Confirmed", icon: CalendarCheck },
  completed: { variant: "success", label: "Completed", icon: CheckCircle },
  cancelled: { variant: "secondary", label: "Cancelled", icon: XCircle },
};

function formatAppointmentTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatAppointmentDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.projectName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeTab === "all" || appointment.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  );

  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = {
    total: mockAppointments.length,
    upcoming: mockAppointments.filter(
      (a) => a.status === "scheduled" || a.status === "confirmed",
    ).length,
    completed: mockAppointments.filter((a) => a.status === "completed").length,
    todayCount: mockAppointments.filter((a) => {
      const apptDate = new Date(a.scheduledDate).toDateString();
      const today = new Date().toDateString();
      return (
        apptDate === today &&
        (a.status === "scheduled" || a.status === "confirmed")
      );
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Appointments
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage site tours
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CalendarCheck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as FilterStatus);
                setCurrentPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-3">
            {paginatedAppointments.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No appointments found
              </div>
            ) : (
              paginatedAppointments.map((appointment) => {
                const StatusIcon = statusConfig[appointment.status].icon;
                return (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-muted shrink-0">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">
                            {appointment.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {appointment.projectName}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={ROUTES.APPOINTMENT_DETAILS(
                                String(appointment.id),
                              )}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {appointment.status === "scheduled" && (
                            <DropdownMenuItem>
                              <CalendarCheck className="h-4 w-4 mr-2" />
                              Mark as Confirmed
                            </DropdownMenuItem>
                          )}
                          {(appointment.status === "scheduled" ||
                            appointment.status === "confirmed") && (
                            <>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                          {formatAppointmentDate(appointment.scheduledDate)}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatAppointmentTime(appointment.scheduledDate)}
                        </span>
                      </div>
                      <Badge variant={statusConfig[appointment.status].variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[appointment.status].label}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Client
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Project
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Date & Time
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground hidden lg:table-cell">
                    Location
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  paginatedAppointments.map((appointment) => {
                    const StatusIcon = statusConfig[appointment.status].icon;
                    return (
                      <tr
                        key={appointment.id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-muted shrink-0">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm">
                                {appointment.clientName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {appointment.clientPhone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-start gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-sm">
                              {appointment.projectName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">
                              {formatAppointmentDate(appointment.scheduledDate)}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatAppointmentTime(appointment.scheduledDate)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={statusConfig[appointment.status].variant}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[appointment.status].label}
                          </Badge>
                        </td>
                        <td className="py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {appointment.location}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={ROUTES.APPOINTMENT_DETAILS(
                                    String(appointment.id),
                                  )}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {appointment.status === "scheduled" && (
                                <DropdownMenuItem>
                                  <CalendarCheck className="h-4 w-4 mr-2" />
                                  Mark as Confirmed
                                </DropdownMenuItem>
                              )}
                              {(appointment.status === "scheduled" ||
                                appointment.status === "confirmed") && (
                                <>
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  sortedAppointments.length,
                )}{" "}
                of {sortedAppointments.length} appointments
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
