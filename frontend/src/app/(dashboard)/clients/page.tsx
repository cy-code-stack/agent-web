"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, generateInitials, formatDate } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

// Mock data - replace with actual API data
const mockClients = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 917 123 4567",
    buyerType: "principal-buyer" as const,
    status: "active" as const,
    source: "Referral",
    createdAt: "2024-01-15T10:30:00Z",
    avatar: null,
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@email.com",
    phone: "+63 918 234 5678",
    buyerType: "principal-buyer" as const,
    status: "active" as const,
    source: "Walk-in",
    createdAt: "2024-01-18T14:15:00Z",
    avatar: null,
  },
  {
    id: 3,
    firstName: "Pedro",
    lastName: "Reyes",
    email: "pedro.reyes@email.com",
    phone: "+63 919 345 6789",
    buyerType: "co-buyer" as const,
    status: "pending" as const,
    source: "Online",
    createdAt: "2024-01-20T09:00:00Z",
    avatar: null,
  },
  {
    id: 4,
    firstName: "Ana",
    lastName: "Garcia",
    email: "ana.garcia@email.com",
    phone: "+63 920 456 7890",
    buyerType: "principal-buyer" as const,
    status: "converted" as const,
    source: "Referral",
    createdAt: "2024-01-22T11:45:00Z",
    avatar: null,
  },
  {
    id: 5,
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+63 921 567 8901",
    buyerType: "principal-buyer" as const,
    status: "inactive" as const,
    source: "Social Media",
    createdAt: "2024-01-25T16:30:00Z",
    avatar: null,
  },
];

type ClientStatus = "all" | "active" | "pending" | "converted" | "inactive";

const statusColors: Record<ClientStatus, string> = {
  all: "",
  active: "success",
  pending: "warning",
  converted: "info",
  inactive: "secondary",
};

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ClientStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || client.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = {
    total: mockClients.length,
    active: mockClients.filter((c) => c.status === "active").length,
    pending: mockClients.filter((c) => c.status === "pending").length,
    converted: mockClients.filter((c) => c.status === "converted").length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            Clients
          </h1>
          <p className="text-muted-foreground">
            Manage your buyers and prospects
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Clients",
            value: stats.total,
            color: "blue",
            icon: Users,
          },
          {
            label: "Active",
            value: stats.active,
            color: "emerald",
            icon: Users,
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "amber",
            icon: Users,
          },
          {
            label: "Converted",
            value: stats.converted,
            color: "violet",
            icon: Users,
          },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="relative group overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div
              className={cn(
                "absolute inset-0 opacity-30 pointer-events-none",
                stat.color === "blue" &&
                  "bg-gradient-to-br from-blue-500/10 to-blue-600/20",
                stat.color === "emerald" &&
                  "bg-gradient-to-br from-emerald-500/10 to-emerald-600/20",
                stat.color === "amber" &&
                  "bg-gradient-to-br from-amber-500/10 to-amber-600/20",
                stat.color === "violet" &&
                  "bg-gradient-to-br from-violet-500/10 to-violet-600/20",
              )}
            />
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2.5 rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110",
                    stat.color === "blue" && "bg-blue-500/15 ring-blue-500/20",
                    stat.color === "emerald" &&
                      "bg-emerald-500/15 ring-emerald-500/20",
                    stat.color === "amber" &&
                      "bg-amber-500/15 ring-amber-500/20",
                    stat.color === "violet" &&
                      "bg-violet-500/15 ring-violet-500/20",
                  )}
                >
                  <stat.icon
                    className={cn(
                      "h-4 w-4",
                      stat.color === "blue" && "text-blue-600",
                      stat.color === "emerald" && "text-emerald-600",
                      stat.color === "amber" && "text-amber-600",
                      stat.color === "violet" && "text-violet-600",
                    )}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as ClientStatus);
                setCurrentPage(1);
              }}
            >
              <TabsList className="bg-muted/50">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="converted"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Converted
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-muted/30 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-3">
            {paginatedClients.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-8 w-8 text-muted-foreground/50" />
                  <p>No clients found</p>
                </div>
              </div>
            ) : (
              paginatedClients.map((client, index) => (
                <div
                  key={client.id}
                  className="border rounded-lg p-4 hover:bg-muted/40 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm shrink-0">
                        <AvatarImage src={client.avatar || undefined} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium">
                          {generateInitials(client.firstName, client.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {client.email}
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
                      <DropdownMenuContent
                        align="end"
                        className="w-48 p-1.5 shadow-lg border-border/50 bg-background/95 backdrop-blur-xl"
                      >
                        <DropdownMenuItem
                          asChild
                          className="rounded-md cursor-pointer"
                        >
                          <Link href={ROUTES.CLIENT_DETAILS(String(client.id))}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-md cursor-pointer">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem className="rounded-md cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {client.phone}
                    </div>
                    <Badge
                      variant={
                        statusColors[client.status] as
                          | "success"
                          | "warning"
                          | "info"
                          | "secondary"
                      }
                      className="capitalize"
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-left bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Client
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Type
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Source
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground/50" />
                        <p>No clients found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client, index) => (
                    <tr
                      key={client.id}
                      className="group hover:bg-muted/40 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage src={client.avatar || undefined} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium">
                              {generateInitials(
                                client.firstName,
                                client.lastName,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">
                              {client.firstName} {client.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {client.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {client.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-sm capitalize px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground font-medium">
                          {client.buyerType.replace("-", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            statusColors[client.status] as
                              | "success"
                              | "warning"
                              | "info"
                              | "secondary"
                          }
                          className="capitalize"
                        >
                          {client.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {client.source}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 p-1.5 shadow-lg border-border/50 bg-background/95 backdrop-blur-xl"
                          >
                            <DropdownMenuItem
                              asChild
                              className="rounded-md cursor-pointer"
                            >
                              <Link
                                href={ROUTES.CLIENT_DETAILS(String(client.id))}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-md cursor-pointer">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem className="rounded-md cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border/50 gap-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredClients.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredClients.length}
                </span>{" "}
                clients
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-3 border-border/50 hover:bg-muted/50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "h-9 w-9 p-0",
                          currentPage === page && "shadow-sm",
                        )}
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-9 px-3 border-border/50 hover:bg-muted/50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
