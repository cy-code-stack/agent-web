<?php

namespace App\Domain\Agent\Contracts;

use App\Infrastructure\Persistence\Eloquent\AgentModel;

interface AgentRepository
{
    public function findById(int $id): ?AgentModel;
    public function findByUserId(int $userId): ?AgentModel;
    public function findByReferralCode(string $code): ?AgentModel;
    public function findByAppointmentRefCode(string $code): ?AgentModel;
    public function save(AgentModel $agent): AgentModel;
    public function update(int $id, array $data): AgentModel;
}
