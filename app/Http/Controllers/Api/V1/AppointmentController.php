<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Appointment\ListAppointments;
use App\Application\Appointment\ScheduleSiteTour;
use App\Application\Appointment\UpdateAppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly ListAppointments $listAppointments,
        private readonly ScheduleSiteTour $scheduleSiteTour,
        private readonly UpdateAppointmentStatus $updateStatus,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $perPage = (int) $request->query('per_page', 15);
        $appointments = $this->listAppointments->handle($agent->id, $perPage);

        return response()->json([
            'data' => AppointmentResource::collection($appointments),
            'meta' => [
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ],
        ]);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $appointment = $this->scheduleSiteTour->handle($agent->id, $request->validated());

        return response()->json(new AppointmentResource($appointment), 201);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:scheduled,confirmed,cancelled,completed,no-show'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $agent = $request->get('_agent');
        $appointment = $this->updateStatus->handle(
            appointmentId: $id,
            agentId: $agent->id,
            status: $request->input('status'),
            notes: $request->input('notes'),
        );

        return response()->json(new AppointmentResource($appointment));
    }
}
