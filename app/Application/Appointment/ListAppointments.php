<?php

namespace App\Application\Appointment;

use App\Domain\Appointment\Contracts\AppointmentRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ListAppointments
{
    public function __construct(private readonly AppointmentRepository $appointmentRepo) {}

    public function handle(int $agentId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->appointmentRepo->findByAgent($agentId, $perPage);
    }
}
