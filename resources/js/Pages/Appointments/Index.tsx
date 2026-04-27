import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Calendar, ChevronDown, Clock, Mail, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { Appointment, PaginationMeta, PageProps } from '@/types';

interface Props extends PageProps {
    appointments: Appointment[];
    meta: PaginationMeta;
}

const statusConfig: Record<string, { bg: string; dot: string; label: string }> = {
    Appointment:     { bg: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    label: 'Scheduled' },
    Visited:         { bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Visited' },
    Done:            { bg: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500',   label: 'Done' },
    'Did not Visit': { bg: 'bg-red-100 text-red-700',       dot: 'bg-red-500',      label: 'No-show' },
    scheduled:       { bg: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    label: 'Scheduled' },
    confirmed:       { bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Confirmed' },
    cancelled:       { bg: 'bg-red-100 text-red-700',       dot: 'bg-red-500',      label: 'Cancelled' },
    completed:       { bg: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500',   label: 'Done' },
    'no-show':       { bg: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500',    label: 'No-show' },
};

const UPDATE_STATUSES = ['Appointment', 'Visited', 'Done', 'Did not Visit'] as const;
const FILTER_TABS = ['All', 'Appointment', 'Visited', 'Done', 'Did not Visit'] as const;
type FilterTab = typeof FILTER_TABS[number];

function isToday(dateStr: string | null): boolean {
    if (!dateStr) return false;
    const today = new Date();
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    return (
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day
    );
}

function isTomorrow(dateStr: string | null): boolean {
    if (!dateStr) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    return (
        tomorrow.getFullYear() === year &&
        tomorrow.getMonth() + 1 === month &&
        tomorrow.getDate() === day
    );
}

function getDateLabel(dateStr: string | null): string | null {
    if (!dateStr) return null;
    if (isToday(dateStr)) return 'Today';
    if (isTomorrow(dateStr)) return 'Tomorrow';
    return null;
}

export default function AppointmentsIndex({ appointments, meta }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

    function updateStatus(id: number, status: string) {
        setUpdatingId(id);
        router.patch(`/appointments/${id}/status`, { status }, {
            preserveScroll: true,
            onFinish: () => setUpdatingId(null),
        });
    }

    const filtered = useMemo(() => {
        if (activeFilter === 'All') return appointments;
        return appointments.filter((a) => a.status === activeFilter);
    }, [appointments, activeFilter]);

    const todayCount = useMemo(
        () => appointments.filter((a) => isToday(a.appointment_date)).length,
        [appointments],
    );

    return (
        <AppLayout>
            <Head title="Appointments" />
            <div className="space-y-4">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Appointments</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {meta.total} appointment{meta.total !== 1 ? 's' : ''} scheduled
                            {todayCount > 0 && (
                                <span className="ml-1.5 inline-flex items-center gap-0.5 font-semibold text-violet-600">
                                    · {todayCount} today
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Today's appointments callout */}
                {todayCount > 0 && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-violet-200 bg-violet-50/60">
                        <div className="h-8 w-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-violet-900">
                                {todayCount === 1 ? 'You have 1 site tour today' : `You have ${todayCount} site tours today`}
                            </p>
                            <p className="text-xs text-violet-600/80">Make sure to follow up with your clients.</p>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-violet-700 hover:bg-violet-100 flex-shrink-0"
                            onClick={() => setActiveFilter('Appointment')}
                        >
                            Filter
                        </Button>
                    </div>
                )}

                {/* Status filter tabs */}
                <div className="flex gap-1.5 flex-wrap">
                    {FILTER_TABS.map((tab) => {
                        const count = tab === 'All'
                            ? appointments.length
                            : appointments.filter((a) => a.status === tab).length;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveFilter(tab)}
                                className={cn(
                                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                                    activeFilter === tab
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-background border-border/50 text-muted-foreground hover:border-border hover:text-foreground',
                                )}
                            >
                                {tab}
                                <span className={cn(
                                    'inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-[10px] font-bold',
                                    activeFilter === tab
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
                                        : 'bg-muted text-muted-foreground',
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Appointments list */}
                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5" />
                            {filtered.length} Appointment{filtered.length !== 1 ? 's' : ''}
                            {activeFilter !== 'All' && (
                                <span className="ml-1 normal-case font-normal">· filtered by "{activeFilter}"</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {appointments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <Calendar className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No appointments scheduled</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Share your appointment link to receive bookings.
                                </p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <p className="text-sm font-medium text-muted-foreground">No "{activeFilter}" appointments</p>
                                <button
                                    type="button"
                                    className="text-xs text-accent underline mt-1"
                                    onClick={() => setActiveFilter('All')}
                                >
                                    Clear filter
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {filtered.map((appt, i) => {
                                    const cfg = statusConfig[appt.status] ?? { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground', label: appt.status };
                                    const isExpanded = expandedId === appt.id;
                                    const dateLabel = getDateLabel(appt.appointment_date);
                                    const todayAppt = isToday(appt.appointment_date);

                                    return (
                                        <div
                                            key={appt.id}
                                            className={cn(
                                                i % 2 === 1 && 'bg-muted/10',
                                                todayAppt && 'bg-violet-50/40',
                                            )}
                                        >
                                            {/* Row */}
                                            <button
                                                type="button"
                                                onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                                                className={cn(
                                                    'w-full flex items-center gap-3 py-3 px-4 text-left transition-colors',
                                                    'hover:bg-accent/5 active:bg-accent/10',
                                                )}
                                            >
                                                {/* Status dot */}
                                                <div className="flex-shrink-0">
                                                    <span className={cn('block h-2.5 w-2.5 rounded-full', cfg.dot)} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <p className="text-sm font-semibold leading-tight">
                                                            {appt.client_fname} {appt.client_lname}
                                                        </p>
                                                        {dateLabel && (
                                                            <span className={cn(
                                                                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                                                dateLabel === 'Today'
                                                                    ? 'bg-violet-100 text-violet-700'
                                                                    : 'bg-blue-100 text-blue-700',
                                                            )}>
                                                                {dateLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        {appt.appointment_date && (
                                                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(appt.appointment_date)}
                                                            </span>
                                                        )}
                                                        {appt.appointment_time && (
                                                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                {appt.appointment_time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex', cfg.bg)}>
                                                        {cfg.label}
                                                    </span>
                                                    <ChevronDown className={cn(
                                                        'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                                                        isExpanded && 'rotate-180',
                                                    )} />
                                                </div>
                                            </button>

                                            {/* Expanded panel */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-3 border-t border-border/30 bg-accent/3 animate-in fade-in slide-in-from-top-1 duration-150">

                                                    {/* Contact info */}
                                                    {(appt.client_contact_number || appt.client_email) && (
                                                        <div className="flex flex-wrap gap-3 mb-3">
                                                            {appt.client_contact_number && (
                                                                <a
                                                                    href={`tel:${appt.client_contact_number}`}
                                                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Phone className="h-3 w-3" />
                                                                    {appt.client_contact_number}
                                                                </a>
                                                            )}
                                                            {appt.client_email && (
                                                                <a
                                                                    href={`mailto:${appt.client_email}`}
                                                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Mail className="h-3 w-3" />
                                                                    {appt.client_email}
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Notes */}
                                                    {appt.notes && (
                                                        <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3 bg-muted/30 rounded-lg px-3 py-2">
                                                            <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                            {appt.notes}
                                                        </p>
                                                    )}

                                                    {/* Status update */}
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                                        Update Status
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {UPDATE_STATUSES.map((s) => {
                                                            const sCfg = statusConfig[s] ?? { bg: 'bg-muted text-muted-foreground', dot: '', label: s };
                                                            const isCurrent = appt.status === s;
                                                            return (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    disabled={updatingId === appt.id || isCurrent}
                                                                    onClick={() => updateStatus(appt.id, s)}
                                                                    className={cn(
                                                                        'text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150',
                                                                        isCurrent
                                                                            ? cn(sCfg.bg, 'border-transparent ring-1 ring-offset-1 scale-105')
                                                                            : 'border-border/50 bg-background hover:border-border text-muted-foreground hover:text-foreground',
                                                                        updatingId === appt.id && 'opacity-50 cursor-not-allowed',
                                                                    )}
                                                                >
                                                                    {s}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                                        onClick={() => router.get('/appointments', { page: meta.current_page - 1 })}
                                    >
                                        ← Prev
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={meta.current_page === meta.last_page}
                                        onClick={() => router.get('/appointments', { page: meta.current_page + 1 })}
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
