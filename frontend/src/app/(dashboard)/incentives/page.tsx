"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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
import { cn, formatCurrency, formatCurrencyCompact, formatDate } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { IncentiveStatus } from "@/types";

// Mock data - replace with actual API data
const mockIncentives = [
  {
    id: 1,
    unitName: "Unit 2B - Marina Heights",
    projectName: "Marina Heights Tower 1",
    clientName: "Juan Dela Cruz",
    amount: 45000,
    status: "paid" as IncentiveStatus,
    dateNeeded: "2024-01-25T00:00:00Z",
    paidDate: "2024-01-20T00:00:00Z",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: 2,
    unitName: "Unit 15A - Parkview Residences",
    projectName: "Parkview Residences",
    clientName: "Maria Santos",
    amount: 32000,
    status: "approved" as IncentiveStatus,
    dateNeeded: "2024-02-15T00:00:00Z",
    paidDate: null,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: 3,
    unitName: "Unit 8C - Skyline Condos",
    projectName: "Skyline Condos",
    clientName: "Pedro Reyes",
    amount: 28000,
    status: "pending" as IncentiveStatus,
    dateNeeded: "2024-02-20T00:00:00Z",
    paidDate: null,
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: 4,
    unitName: "Unit 5A - Marina Heights",
    projectName: "Marina Heights Tower 2",
    clientName: "Ana Garcia",
    amount: 51000,
    status: "paid" as IncentiveStatus,
    dateNeeded: "2024-01-15T00:00:00Z",
    paidDate: "2024-01-12T00:00:00Z",
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: 5,
    unitName: "Unit 12D - Greenfield Estates",
    projectName: "Greenfield Estates",
    clientName: "Carlos Mendoza",
    amount: 62000,
    status: "rejected" as IncentiveStatus,
    dateNeeded: "2024-01-30T00:00:00Z",
    paidDate: null,
    createdAt: "2024-01-05T00:00:00Z",
    rejectionReason: "Incomplete documentation",
  },
  {
    id: 6,
    unitName: "Unit 3B - Sunset Villas",
    projectName: "Sunset Villas",
    clientName: "Elena Cruz",
    amount: 75000,
    status: "pending" as IncentiveStatus,
    dateNeeded: "2024-02-28T00:00:00Z",
    paidDate: null,
    createdAt: "2024-01-22T00:00:00Z",
  },
];

type FilterStatus = "all" | IncentiveStatus;

const statusConfig: Record<
  IncentiveStatus,
  { variant: "warning" | "info" | "success" | "destructive"; label: string; icon: typeof Clock }
> = {
  pending: { variant: "warning", label: "Pending", icon: Clock },
  approved: { variant: "info", label: "Approved", icon: CheckCircle },
  rejected: { variant: "destructive", label: "Rejected", icon: XCircle },
  paid: { variant: "success", label: "Paid", icon: Banknote },
};

export default function IncentivesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredIncentives = mockIncentives.filter((incentive) => {
    const matchesSearch =
      incentive.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incentive.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incentive.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || incentive.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredIncentives.length / itemsPerPage);
  const paginatedIncentives = filteredIncentives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: mockIncentives.length,
    totalAmount: mockIncentives.reduce((sum, i) => sum + i.amount, 0),
    pending: mockIncentives
      .filter((i) => i.status === "pending")
      .reduce((sum, i) => sum + i.amount, 0),
    paid: mockIncentives
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Incentives
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your commissions and payouts
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Wallet className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Incentives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Banknote className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">
                  <span className="sm:hidden">{formatCurrencyCompact(stats.totalAmount)}</span>
                  <span className="hidden sm:inline">{formatCurrency(stats.totalAmount)}</span>
                </p>
                <p className="text-xs text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">
                  <span className="sm:hidden">{formatCurrencyCompact(stats.pending)}</span>
                  <span className="hidden sm:inline">{formatCurrency(stats.pending)}</span>
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
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
                <p className="text-lg sm:text-xl font-bold">
                  <span className="sm:hidden">{formatCurrencyCompact(stats.paid)}</span>
                  <span className="hidden sm:inline">{formatCurrency(stats.paid)}</span>
                </p>
                <p className="text-xs text-muted-foreground">Paid Out</p>
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
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incentives..."
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
            {paginatedIncentives.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No incentives found
              </div>
            ) : (
              paginatedIncentives.map((incentive) => {
                const StatusIcon = statusConfig[incentive.status].icon;
                return (
                  <div
                    key={incentive.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-muted shrink-0">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">
                            {incentive.unitName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {incentive.projectName}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={ROUTES.INCENTIVE_DETAILS(String(incentive.id))}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {formatCurrency(incentive.amount)}
                      </span>
                      <Badge variant={statusConfig[incentive.status].variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[incentive.status].label}
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
                    Property
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Client
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Amount
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground hidden lg:table-cell">
                    Date Needed
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedIncentives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No incentives found
                    </td>
                  </tr>
                ) : (
                  paginatedIncentives.map((incentive) => {
                    const StatusIcon = statusConfig[incentive.status].icon;
                    return (
                      <tr
                        key={incentive.id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-muted shrink-0">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {incentive.unitName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {incentive.projectName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm">{incentive.clientName}</span>
                        </td>
                        <td className="py-4">
                          <span className="font-semibold text-sm">
                            {formatCurrency(incentive.amount)}
                          </span>
                        </td>
                        <td className="py-4">
                          <Badge variant={statusConfig[incentive.status].variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[incentive.status].label}
                          </Badge>
                        </td>
                        <td className="py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(new Date(incentive.dateNeeded))}
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
                                <Link href={ROUTES.INCENTIVE_DETAILS(String(incentive.id))}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
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
                {Math.min(currentPage * itemsPerPage, filteredIncentives.length)} of{" "}
                {filteredIncentives.length} incentives
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
