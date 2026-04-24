<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Appointment\Contracts\AppointmentRepository;
use App\Infrastructure\Persistence\Eloquent\AgentModel;
use App\Infrastructure\Persistence\Eloquent\AppointmentModel;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentAppointmentRepository implements AppointmentRepository
{
    public function findById(int $id): ?AppointmentModel
    {
        return AppointmentModel::with(['realty'])->find($id);
    }

    public function findByAgent(int $agentId, int $perPage = 15): LengthAwarePaginator
    {
        $realtyId = AgentModel::where('id', $agentId)->value('realty_id');

        return AppointmentModel::with(['realty'])
            ->where('realty_id', $realtyId)
            ->orderBy('sched_date', 'asc')
            ->paginate($perPage);
    }

    public function save(AppointmentModel $appointment): AppointmentModel
    {
        $appointment->save();

        return $appointment;
    }

    public function update(int $id, array $data): AppointmentModel
    {
        $appointment = AppointmentModel::findOrFail($id);
        $appointment->update($data);

        return $appointment->fresh();
    }
}
