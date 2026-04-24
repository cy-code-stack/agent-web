<?php

namespace App\Application\Client;

use App\Domain\Client\Contracts\BuyerRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ListAgentClients
{
    public function __construct(private readonly BuyerRepository $buyerRepo) {}

    public function handle(int $agentId, array $filters): LengthAwarePaginator
    {
        return $this->buyerRepo->findByAgent(
            agentId: $agentId,
            search: $filters['search'] ?? null,
            perPage: (int) ($filters['per_page'] ?? 15),
            sortBy: $filters['sort_by'] ?? 'created_at',
            order: $filters['sort_order'] ?? 'desc',
        );
    }
}
