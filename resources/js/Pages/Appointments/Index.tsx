import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, ChevronDown, Clock, MapPin } from 'lucide-react';
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

const statusConfig: Record<string, { bg: string; dot: string }> = {
    Appointment:     { bg: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
    Visited:         { bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    Done:            { bg: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
    'Did not Visit': { bg: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
    scheduled:       { bg: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
    confirmed:       { bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    cancelled:       { bg: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
    completed:       { bg: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
    'no-show':       { bg: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
};

const STATUSES = ['Appointment', 'Visited', 'Done', 'Did not Visit'] as const;

export default function AppointmentsIndex({ appointments, meta }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    function updateStatus(id: number, status: string) {
        setUpdatingId(id);
        router.patch(`/appointments/${id}/status`, { status }, {
            preserveScroll: true,
            onFinish: () => setUpdatingId(null),
        });
    }

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
                        </p>
                    </div>
                </div>

                {/* Appointments list */}
                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5" />
                            {meta.total} Appointment{meta.total !== 1 ? 's' : ''}
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
                        ) : (
                            <div className="divide-y divide-border/30">
                                {appointments.map((appt, i) => {
                                    const cfg = statusConfig[appt.status] ?? { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
                                    const isExpanded = expandedId === appt.id;
                                    return (
                                        <div key={appt.id} className={cn(i % 2 === 1 && 'bg-muted/10')}>
                                            {/* Row */}
                                            <button
                                                type="button"
                                                onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                                                className={cn(
                                                    'w-full flex items-center gap-3 py-2.5 px-4 text-left transition-colors',
                                                    'hover:bg-accent/5 active:bg-accent/10',
                                                )}
                                            >
                                                {/* Status dot */}
                                                <div className="flex-shrink-0">
                                                    <span className={cn('block h-2 w-2 rounded-full mt-0.5', cfg.dot)} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium leading-tight truncate">
                                                        {appt.client_fname} {appt.client_lname}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {appt.appointment_date && (
                                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                                <Calendar className="h-2.5 w-2.5" />
                                                                {formatDate(appt.appointment_date)}
                                                            </span>
                                                        )}
                                                        {appt.appointment_time && (
                                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                                <Clock className="h-2.5 w-2.5" />
                                                                {appt.appointment_time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full hidden sm:inline-flex', cfg.bg)}>
                                                        {appt.status}
                                                    </span>
                                                    <ChevronDown className={cn(
                                                        'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                                                        isExpanded && 'rotate-180',
                                                    )} />
                                                </div>
                                            </button>

                                            {/* Expanded panel */}
                                            {isExpanded && (
                                                <div className="px-4 pb-3 pt-2 border-t border-border/30 bg-accent/3 animate-in fade-in slide-in-from-top-1 duration-150">
                                                    {appt.notes && (
                                                        <p className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
                                                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                            {appt.notes}
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                                        Update Status
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {STATUSES.map((s) => {
                                                            const sCfg = statusConfig[s] ?? { bg: 'bg-muted text-muted-foreground', dot: '' };
                                                            const isCurrent = appt.status === s;
                                                            return (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    disabled={updatingId === appt.id || isCurrent}
                                                                    onClick={() => updateStatus(appt.id, s)}
                                                                    className={cn(
                                                                        'text-[10px] font-semibold px-2 py-1 rounded-full border transition-all duration-150',
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
