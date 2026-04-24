import { Head, Link, router } from '@inertiajs/react';
import { Wallet, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import type { Incentive, PaginationMeta, PageProps } from '@/types';

interface Props extends PageProps {
    incentives: Incentive[];
    meta: PaginationMeta;
}

type BadgeVariant = 'warning' | 'success' | 'info' | 'destructive' | 'secondary';

const statusVariant: Record<string, BadgeVariant> = {
    Pending:   'warning',
    Approved:  'success',
    Released:  'info',
    Cancelled: 'destructive',
};

export default function IncentivesIndex({ incentives, meta }: Props) {
    return (
        <AppLayout>
            <Head title="Incentives" />
            <div className="space-y-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Incentives</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {meta.total} incentive{meta.total !== 1 ? 's' : ''} on record
                    </p>
                </div>

                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Wallet className="h-3.5 w-3.5" />
                            {meta.total} Incentive{meta.total !== 1 ? 's' : ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {incentives.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <TrendingUp className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No incentives yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Your commissions will appear here once sales are processed.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {incentives.map((incentive, i) => (
                                    <Link
                                        key={incentive.id}
                                        href={`/incentives/${incentive.id}`}
                                        className={cn(
                                            'flex items-center gap-3 py-2.5 px-4 transition-colors',
                                            'hover:bg-accent/5 active:bg-accent/10 cursor-pointer',
                                            i % 2 === 1 && 'bg-muted/10',
                                        )}
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                            <Wallet className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-tight">
                                                Incentive #{incentive.id}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Sale #{incentive.sale_id} · {formatDate(incentive.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Badge variant={statusVariant[incentive.status] ?? 'secondary'}>
                                                {incentive.status}
                                            </Badge>
                                            <Eye className="h-3.5 w-3.5 text-muted-foreground/50" />
                                        </div>
                                    </Link>
                                ))}
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
