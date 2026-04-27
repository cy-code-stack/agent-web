import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { User, Phone, MapPin, CreditCard, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { generateInitials } from '@/lib/utils';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps, Agent } from '@/types';

interface Props extends PageProps {
    agent: Agent | null;
}

const GENDER_OPTIONS = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

function Field({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
        </div>
    );
}

export default function ProfileIndex({ agent }: Props) {
    const [form, setForm] = useState({
        first_name: agent?.first_name ?? '',
        last_name: agent?.last_name ?? '',
        middle_name: agent?.middle_name ?? '',
        gender: agent?.gender ?? '',
        email: agent?.email ?? '',
        contact_number: agent?.contact_number ?? '',
        agent_phone_num: agent?.agent_phone_num ?? '',
        agent_landline: agent?.agent_landline ?? '',
        agent_country: agent?.address?.country ?? '',
        agent_region: agent?.address?.region ?? '',
        agent_province: agent?.address?.province ?? '',
        agent_city_mul: agent?.address?.city ?? '',
        agent_brgy: agent?.address?.barangay ?? '',
        agent_street: agent?.address?.street ?? '',
        agent_zip_code: agent?.address?.zip_code ?? '',
        pag_ibig_id: agent?.pag_ibig_id ?? '',
        tin: agent?.tin ?? '',
    });
    const [processing, setProcessing] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        router.put('/profile', form, {
            onFinish: () => setProcessing(false),
        });
    }

    const fullName = agent ? `${agent.first_name} ${agent.last_name}` : 'Agent';
    const initials = agent ? generateInitials(agent.first_name, agent.last_name) : 'AG';
    const genderLabel = GENDER_OPTIONS.find(o => o.value === agent?.gender)?.label;

    return (
        <AppLayout>
            <Head title="Profile" />
            <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-sm text-muted-foreground">Manage your personal information and account details.</p>
                </div>

                {/* Profile Header */}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 self-start sm:self-auto">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 space-y-2">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold leading-tight truncate">{fullName}</h2>
                                    <p className="text-sm text-muted-foreground truncate">{agent?.email}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-[11px] font-medium">Sales Agent</Badge>
                                    {genderLabel && (
                                        <Badge variant="outline" className="text-[11px]">{genderLabel}</Badge>
                                    )}
                                    {agent?.referral_code && (
                                        <Badge variant="outline" className="text-[11px] font-mono">
                                            Ref: {agent.referral_code}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

                    {/* Personal Information */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                                <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <Field id="first_name" label="First Name">
                                    <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} />
                                </Field>
                                <Field id="middle_name" label="Middle Name">
                                    <Input id="middle_name" name="middle_name" value={form.middle_name} onChange={handleChange} placeholder="Optional" />
                                </Field>
                                <Field id="last_name" label="Last Name">
                                    <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} />
                                </Field>
                                <Field id="gender" label="Gender">
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {GENDER_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                                <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
                                </div>
                                <Field id="contact_number" label="Mobile Number">
                                    <Input id="contact_number" name="contact_number" value={form.contact_number} onChange={handleChange} placeholder="e.g. 09XX XXX XXXX" />
                                </Field>
                                <Field id="agent_phone_num" label="Phone Number">
                                    <Input id="agent_phone_num" name="agent_phone_num" value={form.agent_phone_num} onChange={handleChange} placeholder="Optional" />
                                </Field>
                                <Field id="agent_landline" label="Landline">
                                    <Input id="agent_landline" name="agent_landline" value={form.agent_landline} onChange={handleChange} placeholder="Optional" />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                                <MapPin className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <Field id="agent_country" label="Country">
                                    <Input id="agent_country" name="agent_country" value={form.agent_country} onChange={handleChange} />
                                </Field>
                                <Field id="agent_region" label="Region">
                                    <Input id="agent_region" name="agent_region" value={form.agent_region} onChange={handleChange} />
                                </Field>
                                <Field id="agent_province" label="Province">
                                    <Input id="agent_province" name="agent_province" value={form.agent_province} onChange={handleChange} />
                                </Field>
                                <Field id="agent_city_mul" label="City / Municipality">
                                    <Input id="agent_city_mul" name="agent_city_mul" value={form.agent_city_mul} onChange={handleChange} />
                                </Field>
                                <Field id="agent_brgy" label="Barangay">
                                    <Input id="agent_brgy" name="agent_brgy" value={form.agent_brgy} onChange={handleChange} />
                                </Field>
                                <Field id="agent_zip_code" label="ZIP Code">
                                    <Input id="agent_zip_code" name="agent_zip_code" value={form.agent_zip_code} onChange={handleChange} />
                                </Field>
                                <div className="col-span-1 sm:col-span-2 lg:col-span-3 space-y-1.5">
                                    <Label htmlFor="agent_street">Street Address</Label>
                                    <Input id="agent_street" name="agent_street" value={form.agent_street} onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Government IDs */}
                    <Card>
                        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                                <CreditCard className="h-4 w-4 text-violet-600 flex-shrink-0" />
                                Government IDs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <Field id="pag_ibig_id" label="Pag-IBIG ID">
                                    <Input id="pag_ibig_id" name="pag_ibig_id" value={form.pag_ibig_id} onChange={handleChange} placeholder="12-digit number" />
                                </Field>
                                <Field id="tin" label="TIN">
                                    <Input id="tin" name="tin" value={form.tin} onChange={handleChange} placeholder="Tax Identification Number" />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pb-2">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
