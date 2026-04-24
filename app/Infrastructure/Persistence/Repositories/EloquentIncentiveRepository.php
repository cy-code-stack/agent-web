<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Incentive\Contracts\IncentiveRepository;
use App\Infrastructure\Persistence\Eloquent\IncentiveModel;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentIncentiveRepository implements IncentiveRepository
{
    public function findById(int $id): ?IncentiveModel
    {
        return IncentiveModel::with(['agent', 'sale.buyer', 'items', 'unit.project'])->find($id);
    }

    public function findByAgent(int $agentId, int $perPage = 15): LengthAwarePaginator
    {
        return IncentiveModel::with(['sale', 'items'])
            ->where('agent_id', $agentId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
