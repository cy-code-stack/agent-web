"use client";

import {
  Users,
  ShoppingCart,
  Wallet,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

// Mock data - replace with actual API data
const stats = [
  {
    title: "Total Clients",
    value: "24",
    change: "+12%",
    trend: "up" as const,
    icon: Users,
    href: ROUTES.CLIENTS,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/20",
    iconBg: "bg-blue-500/15",
    ringColor: "ring-blue-500/20",
  },
  {
    title: "Active Sales",
    value: "8",
    change: "+3%",
    trend: "up" as const,
    icon: ShoppingCart,
    href: ROUTES.SALES,
    color: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/20",
    iconBg: "bg-emerald-500/15",
    ringColor: "ring-emerald-500/20",
  },
  {
    title: "Pending Incentives",
    value: formatCurrency(125000),
    valueCompact: formatCurrencyCompact(125000),
    change: "-5%",
    trend: "down" as const,
    icon: Wallet,
    href: ROUTES.INCENTIVES,
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-500/10 to-amber-600/20",
    iconBg: "bg-amber-500/15",
    ringColor: "ring-amber-500/20",
  },
  {
    title: "Upcoming Tours",
    value: "5",
    change: "+2",
    trend: "up" as const,
    icon: Calendar,
    href: ROUTES.APPOINTMENTS,
    color: "text-violet-600",
    bgColor: "bg-gradient-to-br from-violet-500/10 to-violet-600/20",
    iconBg: "bg-violet-500/15",
    ringColor: "ring-violet-500/20",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "sale" as const,
    title: "New sale recorded",
    description: "Unit 2B at Marina Heights - Juan Dela Cruz",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "client" as const,
    title: "New client added",
    description: "Maria Santos - Referred by John Doe",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "appointment" as const,
    title: "Site tour scheduled",
    description: "Parkview Residences - Tomorrow at 10:00 AM",
    time: "5 hours ago",
  },
  {
    id: 4,
    type: "incentive" as const,
    title: "Incentive approved",
    description: "Commission for Unit 5A - PHP 45,000",
    time: "1 day ago",
  },
];

const quickActions = [
  {
    title: "Add Client",
    description: "Register a new buyer",
    href: `${ROUTES.CLIENTS}/new`,
  },
  {
    title: "Schedule Tour",
    description: "Book a site visit",
    href: `${ROUTES.APPOINTMENTS}/schedule`,
  },
  {
    title: "View Sales",
    description: "Track your transactions",
    href: ROUTES.SALES,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your activity.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="relative overflow-hidden cursor-pointer group-hover:-translate-y-1 transition-all duration-300">
                {/* Gradient overlay */}
                <div className={cn("absolute inset-0 opacity-50", stat.bgColor)} />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "p-2.5 rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110",
                        stat.iconBg,
                        stat.ringColor
                      )}
                    >
                      <Icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                        stat.trend === "up"
                          ? "text-emerald-700 bg-emerald-100/80"
                          : "text-red-700 bg-red-100/80"
                      )}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {stat.valueCompact ? (
                        <>
                          <span className="sm:hidden">{stat.valueCompact}</span>
                          <span className="hidden sm:inline">{stat.value}</span>
                        </>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                      {stat.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Recent Activity - Takes 2 columns on large screens */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest updates and notifications
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    "group flex items-start gap-4 p-3.5 rounded-xl transition-all duration-200",
                    "hover:bg-muted/60 cursor-pointer",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-xl shrink-0 ring-1 transition-transform duration-200 group-hover:scale-110",
                      activity.type === "sale" && "bg-emerald-500/10 ring-emerald-500/20",
                      activity.type === "client" && "bg-blue-500/10 ring-blue-500/20",
                      activity.type === "appointment" && "bg-violet-500/10 ring-violet-500/20",
                      activity.type === "incentive" && "bg-amber-500/10 ring-amber-500/20"
                    )}
                  >
                    {activity.type === "sale" && (
                      <ShoppingCart className="h-4 w-4 text-emerald-600" />
                    )}
                    {activity.type === "client" && (
                      <Users className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.type === "appointment" && (
                      <Calendar className="h-4 w-4 text-violet-600" />
                    )}
                    {activity.type === "incentive" && (
                      <Wallet className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{activity.title}</p>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 bg-muted/50 px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4 sm:hidden gap-2">
              View all activity
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions - Takes 1 column */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="animate-fade-in-up block"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="group flex items-center justify-between p-3.5 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer">
                    <div>
                      <p className="font-semibold text-sm group-hover:text-accent transition-colors">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {action.description}
                      </p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-accent/10 transition-colors">
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Performance Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Your monthly sales target progress
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 ring-1 ring-primary/10">
              <span className="text-sm text-muted-foreground">This month:</span>
              <span className="text-lg font-bold text-primary">
                <span className="sm:hidden">{formatCurrencyCompact(2450000)}</span>
                <span className="hidden sm:inline">{formatCurrency(2450000)}</span>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Progress to target</span>
                <span className="font-bold text-primary">65%</span>
              </div>
              <div className="h-4 rounded-full bg-muted/50 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: "65%" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>₱0</span>
                <span className="font-medium">
                  Target: <span className="sm:hidden">{formatCurrencyCompact(3750000)}</span>
                  <span className="hidden sm:inline">{formatCurrency(3750000)}</span>
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-border/50">
              {[
                { label: "Units Sold", value: "3", valueCompact: "3", color: "text-blue-600" },
                { label: "Avg. Price", value: formatCurrency(816667), valueCompact: formatCurrencyCompact(816667), color: "text-emerald-600" },
                { label: "Commission", value: formatCurrency(73500), valueCompact: formatCurrencyCompact(73500), color: "text-amber-600" },
                { label: "Days Left", value: "12", valueCompact: "12", color: "text-violet-600" },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="text-center sm:text-left p-3 rounded-xl bg-muted/30 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                  <p className={cn("text-lg font-bold mt-1", item.color)}>
                    <span className="sm:hidden">{item.valueCompact}</span>
                    <span className="hidden sm:inline">{item.value}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
