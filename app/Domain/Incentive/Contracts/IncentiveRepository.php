<?php

namespace App\Domain\Incentive\Contracts;

use App\Infrastructure\Persistence\Eloquent\IncentiveModel;
use Illuminate\Pagination\LengthAwarePaginator;

interface IncentiveRepository
{
    public function findById(int $id): ?IncentiveModel;
    public function findByAgent(int $agentId, int $perPage = 15): LengthAwarePaginator;
}
