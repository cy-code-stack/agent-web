<?php

namespace App\Application\Agent;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Infrastructure\Persistence\Eloquent\AgentModel;

class UpdateAgentProfile
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function handle(int $agentId, array $data): AgentModel
    {
        return $this->agentRepo->update($agentId, $data);
    }
}
