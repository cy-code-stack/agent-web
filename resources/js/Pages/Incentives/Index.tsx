import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Wallet, ChevronRight, Clock, CheckCircle2, XCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import type { Incentive, PaginationMeta, PageProps } from '@/types';

interface Props extends PageProps {
    incentives: Incentive[];
    meta: PaginationMeta;
}

const statusConfig: Record<string, {
    bg: string; text: string; dot: string;
    iconBg: string; iconColor: string;
    Icon: React.ComponentType<{ className?: string }>;
}> = {
    Pending:   { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500',  iconBg: 'bg-amber-50',   iconColor: 'text-amber-500',  Icon: Clock },
    Approved:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', Icon: CheckCircle2 },
    Released:  { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   iconBg: 'bg-blue-50',    iconColor: 'text-blue-500',   Icon: Send },
    Cancelled: { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    iconBg: 'bg-red-50',     iconColor: 'text-red-400',    Icon: XCircle },
};

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Released', 'Cancelled'] as const;
type StatusTab = typeof STATUS_TABS[number];

export default function IncentivesIndex({ incentives, meta }: Props) {
    const [activeTab, setActiveTab] = useState<StatusTab>('All');

    const filtered = useMemo(() => {
        if (activeTab === 'All') return incentives;
        return incentives.filter((i) => i.status === activeTab);
    }, [incentives, activeTab]);

    const tabCounts = useMemo(() => ({
        All:       incentives.length,
        Pending:   incentives.filter((i) => i.status === 'Pending').length,
        Approved:  incentives.filter((i) => i.status === 'Approved').length,
        Released:  incentives.filter((i) => i.status === 'Released').length,
        Cancelled: incentives.filter((i) => i.status === 'Cancelled').length,
    }), [incentives]);

    const pendingCount = tabCounts.Pending;
    const approvedCount = tabCounts.Approved;

    return (
        <AppLayout>
            <Head title="Incentives" />
            <div className="space-y-4">

                {/* Page header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Incentives</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {meta.total} incentive{meta.total !== 1 ? 's' : ''} on record
                    </p>
                </div>

                {/* Status summary callout */}
                {(pendingCount > 0 || approvedCount > 0) && (
                    <div className="grid grid-cols-2 gap-3">
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/60">
                                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">{pendingCount}</p>
                                    <p className="text-[11px] text-amber-700">Pending</p>
                                </div>
                            </div>
                        )}
                        {approvedCount > 0 && (
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
                                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-900">{approvedCount}</p>
                                    <p className="text-[11px] text-emerald-700">Approved</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

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
                            <Wallet className="h-3.5 w-3.5" />
                            {filtered.length} Incentive{filtered.length !== 1 ? 's' : ''}
                            {activeTab !== 'All' && (
                                <span className="ml-1 normal-case font-normal">· {activeTab}</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {incentives.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <Wallet className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No incentives yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Your commissions will appear here once sales are processed.
                                </p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <p className="text-sm font-medium text-muted-foreground">No {activeTab} incentives on this page</p>
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
                                {filtered.map((incentive, i) => {
                                    const cfg = statusConfig[incentive.status];
                                    const Icon = cfg?.Icon ?? Wallet;
                                    const projectName = incentive.unit?.project?.name;
                                    const unitRef = incentive.unit
                                        ? [
                                            incentive.unit.building && `Bldg ${incentive.unit.building}`,
                                            incentive.unit.block_number && `Blk ${incentive.unit.block_number}`,
                                            `Unit ${incentive.unit.unit_number}`,
                                        ].filter(Boolean).join(' · ')
                                        : null;

                                    return (
                                        <Link
                                            key={incentive.id}
                                            href={`/incentives/${incentive.id}`}
                                            className={cn(
                                                'group flex items-center gap-3.5 py-3 px-4 transition-colors',
                                                'hover:bg-accent/5 active:bg-accent/10 cursor-pointer',
                                                i % 2 === 1 && 'bg-muted/10',
                                            )}
                                        >
                                            {/* Status icon */}
                                            <div className={cn(
                                                'flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center',
                                                cfg?.iconBg ?? 'bg-muted/40',
                                            )}>
                                                <Icon className={cn('h-4.5 w-4.5', cfg?.iconColor ?? 'text-muted-foreground')} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold leading-tight group-hover:text-accent transition-colors">
                                                    {incentive.client_name ?? `Incentive #${incentive.id}`}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {projectName && (
                                                        <span className="text-[11px] text-muted-foreground truncate">{projectName}</span>
                                                    )}
                                                    {unitRef && (
                                                        <span className="hidden sm:inline text-[11px] text-muted-foreground/60 flex-shrink-0">
                                                            {unitRef}
                                                        </span>
                                                    )}
                                                    {!projectName && (
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Sale #{incentive.sale_id} · {formatDate(incentive.created_at)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {cfg && (
                                                    <span className={cn(
                                                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                                                        cfg.bg, cfg.text,
                                                    )}>
                                                        {incentive.status}
                                                    </span>
                                                )}
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
                                        onClick={() => router.get('/incentives', { page: meta.current_page - 1 })}
                                    >
                                        ← Prev
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={meta.current_page === meta.last_page}
                                        onClick={() => router.get('/incentives', { page: meta.current_page + 1 })}
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
