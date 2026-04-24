<?php

namespace App\Application\Incentive;

use App\Domain\Incentive\Contracts\IncentiveRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ListAgentIncentives
{
    public function __construct(private readonly IncentiveRepository $incentiveRepo) {}

    public function handle(int $agentId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->incentiveRepo->findByAgent($agentId, $perPage);
    }
}
