import { ReactNode } from 'react';
import { Users, ShoppingCart, Calendar, Wallet } from 'lucide-react';

const features = [
    { icon: Users,       label: 'Client Management',     desc: 'Track every buyer in your portfolio' },
    { icon: ShoppingCart, label: 'Sales Pipeline',        desc: 'Monitor transactions end-to-end' },
    { icon: Calendar,    label: 'Appointment Scheduling', desc: 'Manage site tours effortlessly' },
    { icon: Wallet,      label: 'Incentive Tracking',     desc: 'Stay on top of your commissions' },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">

            {/* Left panel — branding */}
            <div className="hidden md:flex md:w-1/2 lg:w-2/5 relative flex-col justify-between overflow-hidden bg-[hsl(225_54%_23%)]">

                {/* Decorative background shapes */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[hsl(195_100%_50%/0.08)]" />
                    <div className="absolute top-1/3 -left-16 h-48 w-48 rounded-full bg-[hsl(195_100%_50%/0.06)]" />
                    <div className="absolute -bottom-20 right-8 h-64 w-64 rounded-full bg-[hsl(195_100%_50%/0.05)]" />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-12">

                    {/* Logo */}
                    <div>
                        <img
                            src="/images/marrea-dark.png"
                            alt="Marrea Estates Corporation"
                            className="h-11 w-auto"
                        />
                    </div>

                    {/* Hero copy */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <p className="text-[hsl(195_100%_50%)] text-sm font-semibold tracking-widest uppercase">
                                Agent Portal
                            </p>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                Everything you need to close more deals
                            </h1>
                            <p className="text-white/60 text-base leading-relaxed max-w-sm">
                                One platform to manage clients, track sales, and grow your real estate career.
                            </p>
                        </div>

                        {/* Feature list */}
                        <ul className="space-y-3.5">
                            {features.map(({ icon: Icon, label, desc }) => (
                                <li key={label} className="flex items-start gap-3.5">
                                    <div className="mt-0.5 h-8 w-8 rounded-lg bg-[hsl(195_100%_50%/0.12)] flex items-center justify-center flex-shrink-0 border border-[hsl(195_100%_50%/0.2)]">
                                        <Icon className="h-4 w-4 text-[hsl(195_100%_50%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white/90">{label}</p>
                                        <p className="text-xs text-white/45 mt-0.5">{desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                        <div className="h-px bg-white/10" />
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-2xl font-bold text-white">500+</p>
                                <p className="text-xs text-white/50 mt-0.5">Active Agents</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold text-white">10K+</p>
                                <p className="text-xs text-white/50 mt-0.5">Properties Sold</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-2xl font-bold text-white">₱2B+</p>
                                <p className="text-xs text-white/50 mt-0.5">Total Sales</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-white/30">
                            © {new Date().getFullYear()} Marrea Estates Corporation. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex flex-col min-h-screen md:min-h-0 bg-background">

                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border/50">
                    <img
                        src="/images/marrea-light-v2.png"
                        alt="Marrea Estates Corporation"
                        className="h-9 w-auto"
                    />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                        Agent Portal
                    </span>
                </div>

                <div className="flex-1 flex items-center justify-center p-5 sm:p-8 md:p-10">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>

                <div className="md:hidden px-5 py-4 border-t border-border/50 text-center">
                    <p className="text-[11px] text-muted-foreground/60">
                        © {new Date().getFullYear()} Marrea Estates Corporation
                    </p>
                </div>
            </div>
        </div>
    );
}
