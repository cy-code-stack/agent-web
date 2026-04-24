import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users, ShoppingCart, Wallet, Calendar,
    TrendingUp, TrendingDown, ArrowRight, Copy, Check,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatCurrencyCompact } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';

interface DashboardStats {
    total_clients?: number;
    active_sales?: number;
    pending_incentives?: number;
    upcoming_appointments?: number;
}

interface Props extends PageProps {
    stats: DashboardStats;
    referral_link?: string | null;
    appointment_link?: string | null;
}

export default function DashboardIndex({ stats, referral_link, appointment_link }: Props) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    function copyLink(key: string, link: string) {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        });
    }
    const statCards = [
        {
            title: 'Total Clients',
            value: String(stats.total_clients ?? 0),
            trend: 'up' as const,
            icon: Users,
            href: '/clients',
            color: 'text-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
            iconBg: 'bg-blue-500/15',
            ringColor: 'ring-blue-500/20',
        },
        {
            title: 'Active Sales',
            value: String(stats.active_sales ?? 0),
            trend: 'up' as const,
            icon: ShoppingCart,
            href: '/sales',
            color: 'text-emerald-600',
            bgColor: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/20',
            iconBg: 'bg-emerald-500/15',
            ringColor: 'ring-emerald-500/20',
        },
        {
            title: 'Pending Incentives',
            value: formatCurrencyCompact(stats.pending_incentives ?? 0),
            trend: 'up' as const,
            icon: Wallet,
            href: '/incentives',
            color: 'text-amber-600',
            bgColor: 'bg-gradient-to-br from-amber-500/10 to-amber-600/20',
            iconBg: 'bg-amber-500/15',
            ringColor: 'ring-amber-500/20',
        },
        {
            title: 'Upcoming Tours',
            value: String(stats.upcoming_appointments ?? 0),
            trend: 'up' as const,
            icon: Calendar,
            href: '/appointments',
            color: 'text-violet-600',
            bgColor: 'bg-gradient-to-br from-violet-500/10 to-violet-600/20',
            iconBg: 'bg-violet-500/15',
            ringColor: 'ring-violet-500/20',
        },
    ];

    const quickActions = [
        { title: 'View Sales', description: 'Track your transactions', href: '/sales' },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your activity.</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                        return (
                            <Link key={stat.title} href={stat.href} className="group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <Card className="relative overflow-hidden cursor-pointer group-hover:-translate-y-1 transition-all duration-300">
                                    <div className={cn('absolute inset-0 opacity-50', stat.bgColor)} />
                                    <CardContent className="relative p-5">
                                        <div className="flex items-start justify-between">
                                            <div className={cn('p-2.5 rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110', stat.iconBg, stat.ringColor)}>
                                                <Icon className={cn('h-5 w-5', stat.color)} />
                                            </div>
                                            <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full', 'text-emerald-700 bg-emerald-100/80')}>
                                                <TrendIcon className="h-3 w-3" />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.title}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks at your fingertips</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {quickActions.map((action) => (
                                <Link key={action.title} href={action.href}>
                                    <div className="group flex items-center justify-between p-3.5 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer">
                                        <div>
                                            <p className="font-semibold text-sm group-hover:text-accent transition-colors">{action.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
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

                {/* Referral Links */}
                {(referral_link || appointment_link) && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle>Your Referral Links</CardTitle>
                            <CardDescription>Share these links to invite buyers or schedule appointments</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {referral_link && (
                                <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-border/50 bg-muted/20">
                                    <div>
                                        <p className="font-semibold text-sm">Buyer Registration</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{referral_link}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs gap-1.5 self-start"
                                        onClick={() => copyLink('referral', referral_link)}
                                    >
                                        {copiedKey === 'referral'
                                            ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!</>
                                            : <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                                        }
                                    </Button>
                                </div>
                            )}
                            {appointment_link && (
                                <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-border/50 bg-muted/20">
                                    <div>
                                        <p className="font-semibold text-sm">Appointment Booking</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{appointment_link}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs gap-1.5 self-start"
                                        onClick={() => copyLink('appointment', appointment_link)}
                                    >
                                        {copiedKey === 'appointment'
                                            ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!</>
                                            : <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                                        }
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
