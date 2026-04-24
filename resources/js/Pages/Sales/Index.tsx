import { Head, Link, router } from '@inertiajs/react';
import { ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatCurrencyCompact, formatDate } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import type { Sale, PaginationMeta, PageProps } from '@/types';

interface Props extends PageProps {
    sales: Sale[];
    meta: PaginationMeta;
}

const statusColor: Record<string, string> = {
    Active:    'bg-emerald-100 text-emerald-700',
    Pending:   'bg-amber-100 text-amber-700',
    Cancelled: 'bg-red-100 text-red-700',
    Completed: 'bg-blue-100 text-blue-700',
};

export default function SalesIndex({ sales, meta }: Props) {
    return (
        <AppLayout>
            <Head title="Sales" />
            <div className="space-y-4">
                {/* Page header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Sales</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {meta.total} transaction{meta.total !== 1 ? 's' : ''} on record
                    </p>
                </div>

                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {meta.total} Sale{meta.total !== 1 ? 's' : ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {sales.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <TrendingUp className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No sales yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Your transactions will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {sales.map((sale, i) => (
                                    <Link
                                        key={sale.id}
                                        href={`/sales/${sale.id}`}
                                        className={cn(
                                            'flex items-center gap-3 py-2.5 px-4 transition-colors',
                                            'hover:bg-accent/5 active:bg-accent/10 cursor-pointer',
                                            i % 2 === 1 && 'bg-muted/10',
                                        )}
                                    >
                                        {/* ID badge */}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-muted-foreground">
                                                #{sale.id}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-tight">
                                                {sale.buyer
                                                    ? `${sale.buyer.first_name} ${sale.buyer.last_name}`
                                                    : `Sale #${sale.id}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {sale.reservation.date
                                                    ? formatDate(sale.reservation.date)
                                                    : 'No reservation date'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {sale.pricing.tcp != null && (
                                                <span className="hidden sm:block text-sm font-semibold tabular-nums">
                                                    {formatCurrencyCompact(sale.pricing.tcp)}
                                                </span>
                                            )}
                                            <span className={cn(
                                                'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                                                statusColor[sale.status] ?? 'bg-muted text-muted-foreground',
                                            )}>
                                                {sale.status}
                                            </span>
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
