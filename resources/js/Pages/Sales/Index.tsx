import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { ShoppingCart, ChevronRight, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrencyCompact, formatDate, generateInitials } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import type { Sale, PaginationMeta, PageProps } from '@/types';

interface Props extends PageProps {
    sales: Sale[];
    meta: PaginationMeta;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Pending:   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
    Completed: { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500' },
};

const STATUS_TABS = ['All', 'Active', 'Pending', 'Completed'] as const;
type StatusTab = typeof STATUS_TABS[number];

export default function SalesIndex({ sales, meta }: Props) {
    const [activeTab, setActiveTab] = useState<StatusTab>('All');

    const visibleSales = useMemo(
        () => sales.filter((s) => s.status !== 'Cancelled Account'),
        [sales],
    );

    const filtered = useMemo(() => {
        if (activeTab === 'All') return visibleSales;
        return visibleSales.filter((s) => s.status === activeTab);
    }, [visibleSales, activeTab]);

    const tabCounts = useMemo(() => ({
        All:       visibleSales.length,
        Active:    visibleSales.filter((s) => s.status === 'Active').length,
        Pending:   visibleSales.filter((s) => s.status === 'Pending').length,
        Completed: visibleSales.filter((s) => s.status === 'Completed').length,
    }), [visibleSales]);

    const totalTcp = useMemo(
        () => visibleSales.reduce((sum, s) => sum + (s.pricing.tcp ?? 0), 0),
        [visibleSales],
    );

    return (
        <AppLayout>
            <Head title="Sales" />
            <div className="space-y-4">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Sales</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {meta.total} transaction{meta.total !== 1 ? 's' : ''} on record
                        </p>
                    </div>
                    {totalTcp > 0 && (
                        <div className="sm:text-right">
                            <p className="text-xs text-muted-foreground">Total value (this page)</p>
                            <p className="text-lg font-bold text-emerald-600">{formatCurrencyCompact(totalTcp)}</p>
                        </div>
                    )}
                </div>

                {/* Status filter tabs */}
                <div className="flex gap-1.5 flex-wrap">
                    {STATUS_TABS.map((tab) => {
                        const cfg = statusConfig[tab];
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                                    activeTab === tab
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-background border-border/50 text-muted-foreground hover:border-border hover:text-foreground',
                                )}
                            >
                                {tab !== 'All' && cfg && (
                                    <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                                )}
                                {tab}
                                <span className={cn(
                                    'inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-[10px] font-bold',
                                    activeTab === tab
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-muted text-muted-foreground',
                                )}>
                                    {tabCounts[tab]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {filtered.length} Sale{filtered.length !== 1 ? 's' : ''}
                            {activeTab !== 'All' && (
                                <span className="ml-1 normal-case font-normal">· {activeTab}</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {visibleSales.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <ShoppingCart className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No sales yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Your transactions will appear here once processed.
                                </p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <p className="text-sm font-medium text-muted-foreground">No {activeTab} sales on this page</p>
                                <button
                                    type="button"
                                    className="text-xs text-accent underline mt-1"
                                    onClick={() => setActiveTab('All')}
                                >
                                    Clear filter
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {filtered.map((sale, i) => {
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
                                            {/* Avatar */}
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

                        {meta.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/10">
                                <p className="text-xs text-muted-foreground">
                                    Page <span className="font-medium">{meta.current_page}</span> of {meta.last_page}
                                    <span className="hidden sm:inline text-muted-foreground/60"> · {meta.total} total</span>
                                </p>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={meta.current_page === 1}
                                        onClick={() => router.get('/sales', { page: meta.current_page - 1 })}
                                    >
                                        ← Prev
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={meta.current_page === meta.last_page}
                                        onClick={() => router.get('/sales', { page: meta.current_page + 1 })}
                                    >
                                        Next →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
