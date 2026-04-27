import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users, ShoppingCart, Wallet, Calendar,
    ArrowRight, Copy, Check, Building2, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, formatCurrencyCompact, formatDate, generateInitials } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps, Sale } from '@/types';

interface DashboardStats {
    total_clients?: number;
    total_contract_price?: number;
    pending_incentives?: number;
    upcoming_appointments?: number;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Pending:   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
    Completed: { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500' },
};

interface Props extends PageProps {
    stats: DashboardStats;
    referral_link?: string | null;
    appointment_link?: string | null;
    sales?: Sale[];
}

function getGreeting(name: string): { headline: string; sub: string } {
    const hour = new Date().getHours();
    if (hour < 12) return { headline: `Good morning, ${name}!`, sub: "Here's your pipeline overview for today." };
    if (hour < 17) return { headline: `Good afternoon, ${name}!`, sub: "Here's how your pipeline looks right now." };
    return { headline: `Good evening, ${name}!`, sub: "Here's a summary of today's activity." };
}

export default function DashboardIndex({ stats, referral_link, appointment_link, sales = [] }: Props) {
    const { auth } = usePage<PageProps>().props;
    const firstName = auth.user?.name?.split(' ')[0] ?? 'Agent';
    const { headline, sub } = getGreeting(firstName);
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
            subtitle: 'in your portfolio',
            icon: Users,
            href: '/clients',
            color: 'text-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
            iconBg: 'bg-blue-500/15',
            ringColor: 'ring-blue-500/20',
        },
        {
            title: 'Total Sales',
            value: formatCurrencyCompact(stats.total_contract_price ?? 0),
            subtitle: 'total contract price',
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
            subtitle: 'awaiting release',
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
            subtitle: 'site visits scheduled',
            icon: Calendar,
            href: '/appointments',
            color: 'text-violet-600',
            bgColor: 'bg-gradient-to-br from-violet-500/10 to-violet-600/20',
            iconBg: 'bg-violet-500/15',
            ringColor: 'ring-violet-500/20',
        },
    ];

    const quickActions = [
        {
            title: 'My Clients',
            description: 'Manage your buyer portfolio',
            href: '/clients',
            icon: Users,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-500/10',
        },
        {
            title: 'View Sales',
            description: 'Track your transactions',
            href: '/sales',
            icon: ShoppingCart,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-500/10',
        },
        {
            title: 'Appointments',
            description: 'Check scheduled site tours',
            href: '/appointments',
            icon: Calendar,
            iconColor: 'text-violet-600',
            iconBg: 'bg-violet-500/10',
        },
        {
            title: 'Incentives',
            description: 'View your commissions',
            href: '/incentives',
            icon: Wallet,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-500/10',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-6 sm:space-y-8">

                {/* Personalized greeting */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{headline}</h1>
                    <p className="text-muted-foreground">{sub}</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={stat.title}
                                href={stat.href}
                                className="group animate-fade-in-up"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <Card className="relative overflow-hidden cursor-pointer group-hover:-translate-y-1 transition-all duration-300 h-full">
                                    <div className={cn('absolute inset-0 opacity-50', stat.bgColor)} />
                                    <CardContent className="relative p-5">
                                        <div className="flex items-start justify-between">
                                            <div className={cn('p-2.5 rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110', stat.iconBg, stat.ringColor)}>
                                                <Icon className={cn('h-5 w-5', stat.color)} />
                                            </div>
                                            <ArrowRight className={cn(
                                                'h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200',
                                                stat.color,
                                            )} />
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5 font-medium">{stat.title}</p>
                                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{stat.subtitle}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Sales Section */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShoppingCart className="h-4 w-4 text-emerald-600" />
                                Sales
                            </CardTitle>
                            <CardDescription className="mt-0.5">
                                {sales.filter(s => s.status !== 'Cancelled Account').length} transaction{sales.filter(s => s.status !== 'Cancelled Account').length !== 1 ? 's' : ''} on record
                            </CardDescription>
                        </div>
                        <Link href="/sales">
                            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-foreground">
                                View all <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {sales.filter(s => s.status !== 'Cancelled Account').length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <ShoppingCart className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No sales yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">Your transactions will appear here once processed.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {sales.filter(s => s.status !== 'Cancelled Account').map((sale, i) => {
                                    const cfg = statusConfig[sale.status] ?? { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' };
                                    const buyerName = sale.buyer
                                        ? `${sale.buyer.first_name} ${sale.buyer.last_name}`
                                        : `Sale #${sale.id}`;
                                    const initials = sale.buyer
                                        ? generateInitials(sale.buyer.first_name, sale.buyer.last_name)
                                        : `#${sale.id}`;

                                    return (
                                        <Link
                                            key={sale.id}
                                            href={`/sales/${sale.id}`}
                                            className={cn(
                                                'group flex items-center gap-3.5 py-3 px-4 transition-colors',
                                                'hover:bg-accent/5 active:bg-accent/10 cursor-pointer',
                                                i % 2 === 1 && 'bg-muted/10',
                                            )}
                                        >
                                            <Avatar className="h-9 w-9 flex-shrink-0">
                                                <AvatarFallback className={cn(
                                                    'text-white text-[11px] font-bold bg-gradient-to-br',
                                                    sale.status === 'Active'    && 'from-emerald-500 to-emerald-600',
                                                    sale.status === 'Pending'   && 'from-amber-500 to-amber-600',
                                                    sale.status === 'Completed' && 'from-blue-500 to-blue-600',
                                                    !['Active','Pending','Completed'].includes(sale.status) && 'from-primary to-primary/80',
                                                )}>
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold leading-tight truncate group-hover:text-accent transition-colors">
                                                    {buyerName}
                                                </p>
                                                <div className="flex items-center gap-2.5 mt-0.5">
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {sale.reservation.date ? formatDate(sale.reservation.date) : 'No reservation date'}
                                                    </span>
                                                    {sale.pricing.tcp != null && (
                                                        <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <Building2 className="h-3 w-3" />
                                                            {formatCurrencyCompact(sale.pricing.tcp)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="text-right hidden sm:block">
                                                    {sale.pricing.tcp != null && (
                                                        <p className="text-sm font-bold tabular-nums">
                                                            {formatCurrencyCompact(sale.pricing.tcp)}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                                                    cfg.bg, cfg.text,
                                                )}>
                                                    {sale.status}
                                                </span>
                                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Navigate to key sections of your agent portal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Link key={action.title} href={action.href}>
                                        <div className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer text-center h-full">
                                            <div className={cn(
                                                'p-3 rounded-xl transition-transform duration-200 group-hover:scale-110',
                                                action.iconBg,
                                            )}>
                                                <Icon className={cn('h-5 w-5', action.iconColor)} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm group-hover:text-accent transition-colors leading-tight">{action.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 hidden sm:block leading-tight">{action.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Referral Links */}
                {(referral_link || appointment_link) && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle>Your Referral Links</CardTitle>
                            <CardDescription>Share these links to register buyers or book site tours</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {referral_link && (
                                <div className="flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm">Buyer Registration</p>
                                            <p className="text-[11px] text-muted-foreground">For new clients to register</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate font-mono bg-muted/40 px-2 py-1.5 rounded-lg border border-border/30">{referral_link}</p>
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
                                <div className="flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="h-4 w-4 text-violet-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm">Appointment Booking</p>
                                            <p className="text-[11px] text-muted-foreground">For clients to book a site tour</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate font-mono bg-muted/40 px-2 py-1.5 rounded-lg border border-border/30">{appointment_link}</p>
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
