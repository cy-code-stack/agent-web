"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  Search,
  MoreHorizontal,
  Eye,
  CalendarPlus,
  Bed,
  Bath,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { UnitStatus, UnitType } from "@/types";

const mockUnits = [
  {
    id: 1,
    projectName: "Marina Heights Tower 1",
    unitName: "Unit 2B",
    unitType: "2br" as UnitType,
    floorArea: 56.5,
    floor: 2,
    bedrooms: 2,
    bathrooms: 1,
    price: 4500000,
    status: "available" as UnitStatus,
  },
  {
    id: 2,
    projectName: "Parkview Residences",
    unitName: "Unit 15A",
    unitType: "studio" as UnitType,
    floorArea: 28.0,
    floor: 15,
    bedrooms: 0,
    bathrooms: 1,
    price: 2100000,
    status: "available" as UnitStatus,
  },
  {
    id: 3,
    projectName: "Skyline Condos",
    unitName: "Unit 8C",
    unitType: "1br" as UnitType,
    floorArea: 38.2,
    floor: 8,
    bedrooms: 1,
    bathrooms: 1,
    price: 3200000,
    status: "reserved" as UnitStatus,
  },
  {
    id: 4,
    projectName: "Marina Heights Tower 2",
    unitName: "Unit 5A",
    unitType: "3br" as UnitType,
    floorArea: 85.0,
    floor: 5,
    bedrooms: 3,
    bathrooms: 2,
    price: 7800000,
    status: "available" as UnitStatus,
  },
  {
    id: 5,
    projectName: "Greenfield Estates",
    unitName: "Unit 12D",
    unitType: "2br" as UnitType,
    floorArea: 52.0,
    floor: 12,
    bedrooms: 2,
    bathrooms: 1,
    price: 4200000,
    status: "sold" as UnitStatus,
  },
  {
    id: 6,
    projectName: "Sunset Villas",
    unitName: "Unit 3B",
    unitType: "penthouse" as UnitType,
    floorArea: 120.0,
    floor: 20,
    bedrooms: 3,
    bathrooms: 2,
    price: 15000000,
    status: "available" as UnitStatus,
  },
  {
    id: 7,
    projectName: "Marina Heights Tower 1",
    unitName: "Unit 10F",
    unitType: "loft" as UnitType,
    floorArea: 65.0,
    floor: 10,
    bedrooms: 1,
    bathrooms: 1,
    price: 5500000,
    status: "reserved" as UnitStatus,
  },
  {
    id: 8,
    projectName: "Parkview Residences",
    unitName: "Unit 7B",
    unitType: "1br" as UnitType,
    floorArea: 36.0,
    floor: 7,
    bedrooms: 1,
    bathrooms: 1,
    price: 2800000,
    status: "available" as UnitStatus,
  },
];

type FilterStatus = "all" | UnitStatus;

const statusConfig: Record<
  UnitStatus,
  { variant: "success" | "warning" | "secondary"; label: string; icon: typeof CheckCircle2 }
> = {
  available: { variant: "success", label: "Available", icon: CheckCircle2 },
  reserved: { variant: "warning", label: "Reserved", icon: Clock },
  sold: { variant: "secondary", label: "Sold", icon: XCircle },
};

const unitTypeLabels: Record<UnitType, string> = {
  studio: "Studio",
  "1br": "1 Bedroom",
  "2br": "2 Bedrooms",
  "3br": "3 Bedrooms",
  loft: "Loft",
  penthouse: "Penthouse",
};

export default function UnitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const projectNames = Array.from(
    new Set(mockUnits.map((u) => u.projectName)),
  ).sort();

  const filteredUnits = mockUnits.filter((unit) => {
    const matchesSearch =
      unit.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unitTypeLabels[unit.unitType]
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || unit.status === activeTab;
    const matchesProject =
      selectedProject === "all" || unit.projectName === selectedProject;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = {
    total: mockUnits.length,
    available: mockUnits.filter((u) => u.status === "available").length,
    reserved: mockUnits.filter((u) => u.status === "reserved").length,
    sold: mockUnits.filter((u) => u.status === "sold").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            Available Units
          </h1>
          <p className="text-muted-foreground">
            Browse and explore property units across all projects
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Units",
            value: stats.total,
            color: "blue",
            icon: Building,
          },
          {
            label: "Available",
            value: stats.available,
            color: "emerald",
            icon: CheckCircle2,
          },
          {
            label: "Reserved",
            value: stats.reserved,
            color: "amber",
            icon: Clock,
          },
          {
            label: "Sold",
            value: stats.sold,
            color: "violet",
            icon: Layers,
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

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <Tabs
                value={activeTab}
                onValueChange={(v) => {
                  setActiveTab(v as FilterStatus);
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
                    value="available"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Available
                  </TabsTrigger>
                  <TabsTrigger
                    value="reserved"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Reserved
                  </TabsTrigger>
                  <TabsTrigger
                    value="sold"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Sold
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search units, projects..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground shrink-0">
                Project:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-border/50 bg-muted/30 hover:bg-muted/50 font-normal"
                  >
                    <span className="truncate max-w-[200px]">
                      {selectedProject === "all"
                        ? "All Projects"
                        : selectedProject}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 p-1.5 shadow-lg border-border/50 bg-background/95 backdrop-blur-xl"
                >
                  <DropdownMenuItem
                    className={cn(
                      "rounded-md cursor-pointer",
                      selectedProject === "all" && "bg-muted font-medium",
                    )}
                    onClick={() => {
                      setSelectedProject("all");
                      setCurrentPage(1);
                    }}
                  >
                    All Projects
                  </DropdownMenuItem>
                  {projectNames.map((name) => (
                    <DropdownMenuItem
                      key={name}
                      className={cn(
                        "rounded-md cursor-pointer",
                        selectedProject === name && "bg-muted font-medium",
                      )}
                      onClick={() => {
                        setSelectedProject(name);
                        setCurrentPage(1);
                      }}
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedProject !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSelectedProject("all");
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="sm:hidden space-y-3">
            {paginatedUnits.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Building className="h-8 w-8 text-muted-foreground/50" />
                  <p>No units found</p>
                </div>
              </div>
            ) : (
              paginatedUnits.map((unit, index) => (
                <div
                  key={unit.id}
                  className="border rounded-lg p-4 hover:bg-muted/40 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2.5 rounded-xl bg-muted shrink-0">
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm">
                          {unit.unitName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {unit.projectName}
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
                          <Link href={ROUTES.UNIT_DETAILS(String(unit.id))}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {unit.status === "available" && (
                          <DropdownMenuItem className="rounded-md cursor-pointer">
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Schedule Visit
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      {unit.floorArea} sqm
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} BR`}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {unit.bathrooms} BA
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {formatCurrencyCompact(unit.price)}
                    </span>
                    <Badge variant={statusConfig[unit.status].variant}>
                      {statusConfig[unit.status].label}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-left bg-muted/30">
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Type
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Details
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paginatedUnits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Building className="h-8 w-8 text-muted-foreground/50" />
                        <p>No units found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUnits.map((unit, index) => (
                    <tr
                      key={unit.id}
                      className="group hover:bg-muted/40 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-muted shrink-0">
                            <Building className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {unit.unitName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {unit.projectName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-sm capitalize px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground font-medium">
                          {unitTypeLabels[unit.unitType]}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Ruler className="h-3.5 w-3.5" />
                            {unit.floorArea} sqm
                          </span>
                          <span className="flex items-center gap-1">
                            <Bed className="h-3.5 w-3.5" />
                            {unit.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5" />
                            {unit.bathrooms}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-sm">
                          {formatCurrency(unit.price)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusConfig[unit.status].variant}>
                          {statusConfig[unit.status].label}
                        </Badge>
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
                                href={ROUTES.UNIT_DETAILS(String(unit.id))}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {unit.status === "available" && (
                              <DropdownMenuItem className="rounded-md cursor-pointer">
                                <CalendarPlus className="h-4 w-4 mr-2" />
                                Schedule Visit
                              </DropdownMenuItem>
                            )}
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
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-border/50 gap-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredUnits.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredUnits.length}
                </span>{" "}
                units
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
