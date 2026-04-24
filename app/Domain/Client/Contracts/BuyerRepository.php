<?php

namespace App\Domain\Client\Contracts;

use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use Illuminate\Pagination\LengthAwarePaginator;

interface BuyerRepository
{
    public function findById(int $id): ?BuyerModel;
    public function findByAgent(
        int $agentId,
        ?string $search = null,
        int $perPage = 15,
        string $sortBy = 'created_at',
        string $order = 'desc',
    ): LengthAwarePaginator;
    public function save(BuyerModel $buyer): BuyerModel;
    public function update(int $id, array $data): BuyerModel;
    public function allForAgent(int $agentId): \Illuminate\Database\Eloquent\Collection;
}
