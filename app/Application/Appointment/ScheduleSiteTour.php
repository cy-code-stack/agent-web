<?php

namespace App\Application\Appointment;

use App\Domain\Appointment\Contracts\AppointmentRepository;
use App\Infrastructure\Persistence\Eloquent\AppointmentModel;

class ScheduleSiteTour
{
    public function __construct(private readonly AppointmentRepository $appointmentRepo) {}

    public function handle(int $agentId, array $data): AppointmentModel
    {
        $appointment = new AppointmentModel(array_merge($data, [
            'agent_id' => $agentId,
            'status' => 'scheduled',
        ]));

        return $this->appointmentRepo->save($appointment);
    }
}
