<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Sales\Contracts\SaleRepository;
use App\Infrastructure\Persistence\Eloquent\SaleModel;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentSaleRepository implements SaleRepository
{
    public function findById(int $id): ?SaleModel
    {
        return SaleModel::with(['agent', 'buyer', 'project', 'incentives'])->find($id);
    }

    public function findByAgent(int $agentId, int $perPage = 15): LengthAwarePaginator
    {
        return SaleModel::with(['buyer', 'project'])
            ->where('agent_id', $agentId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function save(SaleModel $sale): SaleModel
    {
        $sale->save();

        return $sale;
    }
}
