<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Infrastructure\Persistence\Eloquent\AgentModel;

class EloquentAgentRepository implements AgentRepository
{
    public function findById(int $id): ?AgentModel
    {
        return AgentModel::with(['user'])->find($id);
    }

    public function findByUserId(int $userId): ?AgentModel
    {
        return AgentModel::with(['user'])->where('user_id', $userId)->first();
    }

    public function findByReferralCode(string $code): ?AgentModel
    {
        return AgentModel::where('referral_code', $code)->first();
    }

    public function findByAppointmentRefCode(string $code): ?AgentModel
    {
        return AgentModel::where('appointment_ref_code', $code)->first();
    }

    public function save(AgentModel $agent): AgentModel
    {
        $agent->save();

        return $agent;
    }

    public function update(int $id, array $data): AgentModel
    {
        $agent = AgentModel::findOrFail($id);
        $agent->update($data);

        return $agent->fresh();
    }
}
