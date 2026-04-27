import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/Layouts/AuthLayout';
import { cn } from '@/lib/utils';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const hasError = !!errors.email || !!errors.password;

    return (
        <AuthLayout>
            <Head title="Sign In" />

            <div className="space-y-8 animate-fade-in-up">

                {/* Heading */}
                <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your agent portal to continue
                    </p>
                </div>

                {/* Error alert */}
                {hasError && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 animate-fade-in">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-destructive leading-snug">
                            {errors.email || errors.password}
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">

                    {/* Email field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">
                            Email address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@marrea.com"
                                className={cn(
                                    'pl-10 h-11 text-sm transition-all',
                                    errors.email && 'border-destructive focus-visible:ring-destructive/30',
                                )}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                autoFocus
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className={cn(
                                    'pl-10 pr-11 h-11 text-sm transition-all',
                                    errors.password && 'border-destructive focus-visible:ring-destructive/30',
                                )}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                disabled={processing}
                            />
                            <button
                                type="button"
                                className="absolute right-0 top-0 h-full px-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {showPassword
                                    ? <EyeOff className="h-4 w-4" />
                                    : <Eye className="h-4 w-4" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            disabled={processing}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground select-none">
                            Keep me signed in for 30 days
                        </Label>
                    </div>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        className="w-full h-11 text-sm font-semibold gap-2"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Signing in…
                            </>
                        ) : (
                            'Sign in to Portal'
                        )}
                    </Button>
                </form>

                {/* Footer note */}
                <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-center text-muted-foreground leading-relaxed">
                        Don&apos;t have an account?{' '}
                        <span className="font-semibold text-foreground">
                            Contact your administrator
                        </span>{' '}
                        to get access.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
