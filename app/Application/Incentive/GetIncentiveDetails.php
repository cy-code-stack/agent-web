<?php

namespace App\Application\Incentive;

use App\Domain\Incentive\Contracts\IncentiveRepository;
use App\Infrastructure\Persistence\Eloquent\IncentiveModel;
use Illuminate\Auth\Access\AuthorizationException;

class GetIncentiveDetails
{
    public function __construct(private readonly IncentiveRepository $incentiveRepo) {}

    public function handle(int $incentiveId, int $agentId): IncentiveModel
    {
        $incentive = $this->incentiveRepo->findById($incentiveId);

        if (! $incentive || $incentive->agent_id !== $agentId) {
            throw new AuthorizationException('Incentive not found or not accessible.');
        }

        return $incentive;
    }
}
