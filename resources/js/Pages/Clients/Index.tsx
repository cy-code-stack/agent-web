import { Head, Link, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Users, Search, Phone, Mail, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/Layouts/AppLayout";
import { cn } from "@/lib/utils";
import type { Client, PaginationMeta, PageProps } from "@/types";

interface Props extends PageProps {
    clients: Client[];
    meta: PaginationMeta;
    filters: { search?: string };
}

const buyerTypeConfig: Record<string, { bg: string; text: string; dotColor: string }> = {
    Individual: { bg: "bg-blue-100",   text: "text-blue-700",   dotColor: "bg-blue-500" },
    Corporate:  { bg: "bg-violet-100", text: "text-violet-700", dotColor: "bg-violet-500" },
    OFW:        { bg: "bg-amber-100",  text: "text-amber-700",  dotColor: "bg-amber-500" },
};

const avatarColors: Record<string, string> = {
    Individual: "from-blue-500 to-blue-600",
    Corporate:  "from-violet-500 to-violet-600",
    OFW:        "from-amber-500 to-amber-600",
};

const BUYER_TYPE_TABS = ["All", "Individual", "Corporate", "OFW"] as const;
type BuyerTypeTab = typeof BUYER_TYPE_TABS[number];

export default function ClientsIndex({ clients, meta, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [activeTab, setActiveTab] = useState<BuyerTypeTab>("All");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get("/clients", { search }, { preserveState: true, replace: true });
    };

    const clearSearch = () => {
        setSearch("");
        router.get("/clients", {}, { preserveState: true, replace: true });
    };

    const filtered = useMemo(() => {
        if (activeTab === "All") return clients;
        return clients.filter((c) => c.buyer_type === activeTab);
    }, [clients, activeTab]);

    const tabCounts = useMemo(() => ({
        All: clients.length,
        Individual: clients.filter((c) => c.buyer_type === "Individual").length,
        Corporate:  clients.filter((c) => c.buyer_type === "Corporate").length,
        OFW:        clients.filter((c) => c.buyer_type === "OFW").length,
    }), [clients]);

    return (
        <AppLayout>
            <Head title="Clients" />
            <div className="space-y-4">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Clients</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {meta.total} buyer{meta.total !== 1 ? "s" : ""} in your portfolio
                        </p>
                    </div>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email…"
                            className="pl-8 h-9 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-9 text-xs px-4">
                        Search
                    </Button>
                    {search && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 text-xs"
                            onClick={clearSearch}
                        >
                            Clear
                        </Button>
                    )}
                </form>

                {/* Buyer type filter tabs */}
                <div className="flex gap-1.5 flex-wrap">
                    {BUYER_TYPE_TABS.map((tab) => {
                        const cfg = buyerTypeConfig[tab];
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
                                    activeTab === tab
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                        : "bg-background border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                                )}
                            >
                                {tab !== "All" && cfg && (
                                    <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dotColor)} />
                                )}
                                {tab}
                                <span className={cn(
                                    "inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-[10px] font-bold",
                                    activeTab === tab
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-muted text-muted-foreground",
                                )}>
                                    {tabCounts[tab]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Clients list */}
                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Users className="h-3.5 w-3.5" />
                            {filtered.length} Client{filtered.length !== 1 ? "s" : ""}
                            {activeTab !== "All" && (
                                <span className="ml-1 normal-case font-normal">· {activeTab}</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {clients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <Users className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">No clients found</p>
                                {search && (
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        Try a different search term
                                    </p>
                                )}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                <p className="text-sm font-medium text-muted-foreground">No {activeTab} clients on this page</p>
                                <button
                                    type="button"
                                    className="text-xs text-accent underline mt-1"
                                    onClick={() => setActiveTab("All")}
                                >
                                    Clear filter
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {filtered.map((client, i) => {
                                    const cfg = buyerTypeConfig[client.buyer_type];
                                    const gradientColor = avatarColors[client.buyer_type] ?? "from-primary to-primary/80";
                                    return (
                                        <Link
                                            key={client.id}
                                            href={`/clients/${client.id}`}
                                            className={cn(
                                                "group flex items-center gap-3.5 py-3 px-4 transition-colors",
                                                "hover:bg-accent/5 active:bg-accent/10 cursor-pointer",
                                                i % 2 === 1 && "bg-muted/10",
                                            )}
                                        >
                                            <Avatar className="h-9 w-9 flex-shrink-0">
                                                <AvatarFallback className={cn("text-white text-[11px] font-bold bg-gradient-to-br", gradientColor)}>
                                                    {generateInitials(client.first_name, client.last_name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold leading-tight truncate group-hover:text-accent transition-colors">
                                                    {client.first_name} {client.last_name}
                                                </p>
                                                <div className="flex items-center gap-2.5 mt-0.5">
                                                    {client.email && (
                                                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                                                            <Mail className="h-3 w-3 flex-shrink-0" />
                                                            <span className="truncate">{client.email}</span>
                                                        </span>
                                                    )}
                                                    {client.contact_number && (
                                                        <span className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground flex-shrink-0">
                                                            <Phone className="h-3 w-3" />
                                                            {client.contact_number}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {cfg && (
                                                    <span className={cn(
                                                        "hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full",
                                                        cfg.bg, cfg.text,
                                                    )}>
                                                        {client.buyer_type}
                                                    </span>
                                                )}
                                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
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
                                        onClick={() => router.get("/clients", { page: meta.current_page - 1, search })}
                                    >
                                        ← Prev
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={meta.current_page === meta.last_page}
                                        onClick={() => router.get("/clients", { page: meta.current_page + 1, search })}
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
