<?php

namespace App\Application\Appointment;

use App\Domain\Appointment\Contracts\AppointmentRepository;
use App\Infrastructure\Persistence\Eloquent\AgentModel;
use App\Infrastructure\Persistence\Eloquent\AppointmentModel;
use Illuminate\Auth\Access\AuthorizationException;

class UpdateAppointmentStatus
{
    public function __construct(private readonly AppointmentRepository $appointmentRepo) {}

    public function handle(int $appointmentId, int $agentId, string $status, ?string $notes = null): AppointmentModel
    {
        $appointment = $this->appointmentRepo->findById($appointmentId);
        $realtyId = AgentModel::where('id', $agentId)->value('realty_id');

        if (! $appointment || $appointment->realty_id !== $realtyId) {
            throw new AuthorizationException('Appointment not found or not accessible.');
        }

        $data = ['status' => $status];
        if ($notes !== null) {
            $data['notes'] = $notes;
        }

        return $this->appointmentRepo->update($appointmentId, $data);
    }
}
