<?php

namespace App\Domain\Appointment\Contracts;

use App\Infrastructure\Persistence\Eloquent\AppointmentModel;
use Illuminate\Pagination\LengthAwarePaginator;

interface AppointmentRepository
{
    public function findById(int $id): ?AppointmentModel;
    public function findByAgent(int $agentId, int $perPage = 15): LengthAwarePaginator;
    public function save(AppointmentModel $appointment): AppointmentModel;
    public function update(int $id, array $data): AppointmentModel;
}
