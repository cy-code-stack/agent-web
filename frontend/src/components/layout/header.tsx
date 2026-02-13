"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationDropdown } from "./notification-dropdown";
import { useSidebarStore, useAuthStore } from "@/lib/store";
import { generateInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export function Header() {
  const router = useRouter();
  const { toggleMobile } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const initials = user
    ? generateInitials(user.firstName, user.lastName)
    : "AG";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-6 shadow-sm">
      {/* Left side - Mobile menu button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent/50 transition-colors"
          onClick={toggleMobile}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title - can be dynamic */}
        <h1 className="text-lg font-semibold hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Dashboard
        </h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9 ring-2 ring-background shadow-md">
                <AvatarImage src={user?.avatar} alt={user?.firstName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 shadow-lg border-border/50 bg-background/95 backdrop-blur-xl">
            <DropdownMenuLabel className="px-2 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-accent/20">
                  <AvatarImage src={user?.avatar} alt={user?.firstName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">
                    {user ? `${user.firstName} ${user.lastName}` : "Agent User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "agent@example.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={() => router.push(ROUTES.PROFILE)}
              className="cursor-pointer rounded-md my-1 transition-colors"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md my-1 transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
