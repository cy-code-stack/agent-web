import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { Incentive, PageProps } from '@/types';

type BadgeVariant = 'warning' | 'success' | 'info' | 'destructive' | 'secondary';

const statusVariant: Record<string, BadgeVariant> = {
    Pending:   'warning',
    Approved:  'success',
    Released:  'info',
    Cancelled: 'destructive',
};

interface Props extends PageProps {
    incentive: Incentive;
}

export default function IncentiveShow({ incentive }: Props) {
    return (
        <AppLayout>
            <Head title={`Incentive #${incentive.id}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/incentives">
                        <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Incentive #{incentive.id}</h1>
                        <Badge variant={statusVariant[incentive.status] ?? 'secondary'} className="mt-1">{incentive.status}</Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <InfoRow label="Status" value={incentive.status} />
                        <InfoRow label="Client" value={incentive.client_name ?? '—'} />
                        {incentive.unit && (
                            <>
                                <InfoRow label="Project" value={incentive.unit.project?.name ?? '—'} />
                                <InfoRow label="Block" value={incentive.unit.block_number ?? '—'} />
                                <InfoRow label="Lot" value={incentive.unit.unit_number} />
                            </>
                        )}
                        <InfoRow label="Created" value={formatDate(incentive.created_at)} />
                    </CardContent>
                </Card>
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
