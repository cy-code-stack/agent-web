<?php

namespace App\Application\Agent;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Infrastructure\Persistence\Eloquent\AgentModel;

class GetAgentProfile
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function handle(int $userId): ?AgentModel
    {
        return $this->agentRepo->findByUserId($userId);
    }
}
