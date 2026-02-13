"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  FileText,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  TrendingUp,
  Clock,
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
import {
  cn,
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
} from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

// Mock data - replace with actual API data
const mockSales = [
  {
    id: 1,
    unitName: "Unit 2B - Marina Heights",
    projectName: "Marina Heights Tower 1",
    clientName: "Juan Dela Cruz",
    price: 4500000,
    status: "completed" as const,
    paymentStatus: "fully-paid" as const,
    reservationDate: "2024-01-10T00:00:00Z",
    turnoverDate: "2024-06-15T00:00:00Z",
  },
  {
    id: 2,
    unitName: "Unit 15A - Parkview Residences",
    projectName: "Parkview Residences",
    clientName: "Maria Santos",
    price: 3200000,
    status: "processing" as const,
    paymentStatus: "partial" as const,
    reservationDate: "2024-01-15T00:00:00Z",
    turnoverDate: "2024-07-20T00:00:00Z",
  },
  {
    id: 3,
    unitName: "Unit 8C - Skyline Condos",
    projectName: "Skyline Condos",
    clientName: "Pedro Reyes",
    price: 2800000,
    status: "reserved" as const,
    paymentStatus: "reservation-fee" as const,
    reservationDate: "2024-01-20T00:00:00Z",
    turnoverDate: null,
  },
  {
    id: 4,
    unitName: "Unit 5A - Marina Heights",
    projectName: "Marina Heights Tower 2",
    clientName: "Ana Garcia",
    price: 5100000,
    status: "completed" as const,
    paymentStatus: "fully-paid" as const,
    reservationDate: "2024-01-08T00:00:00Z",
    turnoverDate: "2024-05-30T00:00:00Z",
  },
  {
    id: 5,
    unitName: "Unit 12D - Greenfield Estates",
    projectName: "Greenfield Estates",
    clientName: "Carlos Mendoza",
    price: 6200000,
    status: "cancelled" as const,
    paymentStatus: "refunded" as const,
    reservationDate: "2024-01-05T00:00:00Z",
    turnoverDate: null,
  },
  {
    id: 6,
    unitName: "Unit 3B - Sunset Villas",
    projectName: "Sunset Villas",
    clientName: "Elena Cruz",
    price: 7500000,
    status: "processing" as const,
    paymentStatus: "partial" as const,
    reservationDate: "2024-01-22T00:00:00Z",
    turnoverDate: "2024-08-10T00:00:00Z",
  },
];

type SaleStatus = "all" | "reserved" | "processing" | "completed" | "cancelled";

const statusConfig: Record<
  Exclude<SaleStatus, "all">,
  { variant: "warning" | "info" | "success" | "destructive"; label: string }
> = {
  reserved: { variant: "warning", label: "Reserved" },
  processing: { variant: "info", label: "Processing" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
};

const paymentStatusConfig: Record<
  string,
  { variant: "warning" | "info" | "success" | "secondary"; label: string }
> = {
  "reservation-fee": { variant: "warning", label: "Reservation Fee" },
  partial: { variant: "info", label: "Partial Payment" },
  "fully-paid": { variant: "success", label: "Fully Paid" },
  refunded: { variant: "secondary", label: "Refunded" },
};

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SaleStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSales = mockSales.filter((sale) => {
    const matchesSearch =
      sale.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || sale.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = {
    total: mockSales.length,
    totalValue: mockSales
      .filter((s) => s.status !== "cancelled")
      .reduce((sum, s) => sum + s.price, 0),
    completed: mockSales.filter((s) => s.status === "completed").length,
    processing: mockSales.filter((s) => s.status === "processing").length,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sales
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your property sales
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">
                  <span className="sm:hidden">
                    {formatCurrencyCompact(stats.totalValue)}
                  </span>
                  <span className="hidden sm:inline">
                    {formatCurrency(stats.totalValue)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <ShoppingCart className="h-4 w-4 text-emerald-600" />
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
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
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
                setActiveTab(v as SaleStatus);
                setCurrentPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="reserved">Reserved</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales..."
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
            {paginatedSales.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No sales found
              </div>
            ) : (
              paginatedSales.map((sale) => (
                <div
                  key={sale.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {sale.unitName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {sale.projectName}
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
                          <Link href={ROUTES.SALE_DETAILS(String(sale.id))}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Contract
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {formatCurrency(sale.price)}
                    </span>
                    <Badge variant={statusConfig[sale.status].variant}>
                      {statusConfig[sale.status].label}
                    </Badge>
                  </div>
                </div>
              ))
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
                  <th className="pb-3 font-medium text-sm text-muted-foreground hidden md:table-cell">
                    Price
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground hidden lg:table-cell">
                    Payment
                  </th>
                  <th className="pb-3 font-medium text-sm text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No sales found
                    </td>
                  </tr>
                ) : (
                  paginatedSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted shrink-0">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {sale.unitName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {sale.projectName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{sale.clientName}</span>
                        </div>
                      </td>
                      <td className="py-4 hidden md:table-cell">
                        <span className="font-medium text-sm">
                          {formatCurrency(sale.price)}
                        </span>
                      </td>
                      <td className="py-4">
                        <Badge variant={statusConfig[sale.status].variant}>
                          {statusConfig[sale.status].label}
                        </Badge>
                      </td>
                      <td className="py-4 hidden lg:table-cell">
                        <Badge
                          variant={
                            paymentStatusConfig[sale.paymentStatus].variant
                          }
                        >
                          {paymentStatusConfig[sale.paymentStatus].label}
                        </Badge>
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
                              <Link href={ROUTES.SALE_DETAILS(String(sale.id))}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Contract
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredSales.length)} of{" "}
                {filteredSales.length} sales
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
