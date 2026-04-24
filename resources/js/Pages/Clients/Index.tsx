import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Users, Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const buyerTypeColor: Record<string, string> = {
    Individual: "bg-blue-100 text-blue-700",
    Corporate: "bg-violet-100 text-violet-700",
    OFW: "bg-amber-100 text-amber-700",
};

export default function ClientsIndex({ clients, meta, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/clients",
            { search },
            { preserveState: true, replace: true },
        );
    };

    const clearSearch = () => {
        setSearch("");
        router.get("/clients", {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="Clients" />
            <div className="space-y-4">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Clients
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {meta.total} buyer{meta.total !== 1 ? "s" : ""} in
                            your portfolio
                        </p>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email…"
                            className="pl-8 h-8 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-8 text-xs">
                        Search
                    </Button>
                    {search && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={clearSearch}
                        >
                            Clear
                        </Button>
                    )}
                </form>

                {/* Clients table */}
                <Card className="overflow-hidden">
                    <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-muted/20">
                        <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <Users className="h-3.5 w-3.5" />
                            {meta.total} Client{meta.total !== 1 ? "s" : ""}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {clients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <Users className="h-8 w-8 text-muted-foreground/25 mb-2" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    No clients found
                                </p>
                                {search && (
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        Try a different search term
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {clients.map((client, i) => (
                                    <Link
                                        key={client.id}
                                        href={`/clients/${client.id}`}
                                        className={cn(
                                            "flex items-center gap-3 py-2.5 px-4 transition-colors",
                                            "hover:bg-accent/5 active:bg-accent/10 cursor-pointer",
                                            i % 2 === 1 && "bg-muted/10",
                                        )}
                                    >
                                        <Avatar className="h-7 w-7 flex-shrink-0">
                                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                                                {generateInitials(
                                                    client.first_name,
                                                    client.last_name,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-tight truncate">
                                                {client.first_name}{" "}
                                                {client.last_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {client.email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span
                                                className={cn(
                                                    "hidden sm:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                                    buyerTypeColor[
                                                        client.buyer_type
                                                    ] ??
                                                        "bg-muted text-muted-foreground",
                                                )}
                                            >
                                                {client.buyer_type}
                                            </span>
                                            <Eye className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {meta.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/10">
                                <p className="text-xs text-muted-foreground">
                                    Page{" "}
                                    <span className="font-medium">
                                        {meta.current_page}
                                    </span>{" "}
                                    of {meta.last_page}
                                    <span className="hidden sm:inline text-muted-foreground/60">
                                        {" "}
                                        · {meta.total} total
                                    </span>
                                </p>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={meta.current_page === 1}
                                        onClick={() =>
                                            router.get("/clients", {
                                                page: meta.current_page - 1,
                                                search,
                                            })
                                        }
                                    >
                                        ← Prev
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs px-2.5"
                                        disabled={
                                            meta.current_page === meta.last_page
                                        }
                                        onClick={() =>
                                            router.get("/clients", {
                                                page: meta.current_page + 1,
                                                search,
                                            })
                                        }
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
