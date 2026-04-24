<?php

namespace App\Domain\Sales\Contracts;

use App\Infrastructure\Persistence\Eloquent\SaleModel;
use Illuminate\Pagination\LengthAwarePaginator;

interface SaleRepository
{
    public function findById(int $id): ?SaleModel;
    public function findByAgent(int $agentId, int $perPage = 15): LengthAwarePaginator;
    public function save(SaleModel $sale): SaleModel;
}
