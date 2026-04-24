import { router, usePage } from '@inertiajs/react';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSidebar } from '@/Layouts/AppLayout';
import { NotificationBell } from '@/components/layout/notification-bell';
import { generateInitials } from '@/lib/utils';
import type { PageProps } from '@/types';

export function Header() {
    const { setMobileOpen } = useSidebar();
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleLogout = () => {
        router.post('/logout');
    };

    const initials = user ? generateInitials(user.name, '') : 'AG';

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-9 w-9 hover:bg-accent/50 transition-colors rounded-full"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Toggle mobile menu"
                >
                    <Menu className="h-4.5 w-4.5" />
                </Button>
                <h1 className="text-sm font-semibold hidden sm:block tracking-wide text-muted-foreground">
                    Marrea Agent
                </h1>
            </div>

            <div className="flex items-center gap-1.5">
                <NotificationBell />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200"
                            aria-label="User menu"
                        >
                            <Avatar className="h-8 w-8 ring-2 ring-background shadow-md">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 shadow-lg border-border/50 bg-background/95 backdrop-blur-xl">
                        <DropdownMenuLabel className="px-2 py-2.5">
                            <div className="flex items-center gap-2.5">
                                <Avatar className="h-9 w-9 ring-2 ring-accent/20">
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-semibold truncate">{user?.name ?? 'Agent User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem
                            onClick={() => router.get('/profile')}
                            className="cursor-pointer rounded-md my-1 transition-colors"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer rounded-md my-1 text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
