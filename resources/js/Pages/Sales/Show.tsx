import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { Sale, PageProps } from '@/types';

interface Props extends PageProps {
    sale: Sale;
}

export default function SaleShow({ sale }: Props) {
    return (
        <AppLayout>
            <Head title={`Sale #${sale.id}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/sales">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Sale #{sale.id}</h1>
                        <Badge variant="secondary" className="mt-1">{sale.status}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Reservation Details</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {sale.reservation.date && <InfoRow label="Reservation Date" value={formatDate(sale.reservation.date)} />}
                            {sale.reservation.fee != null && <InfoRow label="Reservation Fee" value={formatCurrency(sale.reservation.fee)} />}
                            {sale.reservation.promo_code && <InfoRow label="Promo Code" value={sale.reservation.promo_code} />}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {sale.pricing.tcp != null && <InfoRow label="Total Contract Price" value={formatCurrency(sale.pricing.tcp)} />}
                            {sale.pricing.dp_amount != null && <InfoRow label="Down Payment" value={formatCurrency(sale.pricing.dp_amount)} />}
                            {sale.pricing.balance != null && <InfoRow label="Balance" value={formatCurrency(sale.pricing.balance)} />}
                            {sale.pricing.total_paid != null && <InfoRow label="Total Paid" value={formatCurrency(sale.pricing.total_paid)} />}
                        </CardContent>
                    </Card>

                    {sale.financing.type && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">Financing</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <InfoRow label="Type" value={sale.financing.type} />
                                {sale.financing.bank && <InfoRow label="Bank" value={sale.financing.bank} />}
                                {sale.financing.amount != null && <InfoRow label="Amount" value={formatCurrency(sale.financing.amount)} />}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    );
}
