import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { Client, PageProps } from '@/types';

interface Props extends PageProps {
    client: Client;
}

export default function ClientShow({ client }: Props) {
    return (
        <AppLayout>
            <Head title={`${client.first_name} ${client.last_name}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/clients">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{client.first_name} {client.last_name}</h1>
                        <Badge variant="secondary" className="mt-1">{client.buyer_type}</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <InfoRow icon={<User className="h-4 w-4" />} label="Full Name" value={`${client.first_name} ${client.middle_name ? client.middle_name + ' ' : ''}${client.last_name}`} />
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={client.email} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Contact" value={client.contact_number ?? '—'} />
                            {client.birth_date && <InfoRow label="Birth Date" value={formatDate(client.birth_date)} />}
                            {client.nationality && <InfoRow label="Nationality" value={client.nationality} />}
                            {client.civil_status && <InfoRow label="Civil Status" value={client.civil_status} />}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Financial Information</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {client.occupation && <InfoRow label="Occupation" value={client.occupation} />}
                            {client.employer && <InfoRow label="Employer" value={client.employer} />}
                            {client.monthly_income != null && <InfoRow label="Monthly Income" value={`₱${client.monthly_income.toLocaleString()}`} />}
                            {client.tin && <InfoRow label="TIN" value={client.tin} />}
                            {client.pag_ibig_id && <InfoRow label="Pag-IBIG ID" value={client.pag_ibig_id} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium truncate">{value}</p>
            </div>
        </div>
    );
}
