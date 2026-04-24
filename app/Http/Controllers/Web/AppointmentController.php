<?php

namespace App\Http\Controllers\Web;

use App\Application\Appointment\ListAppointments;
use App\Application\Appointment\ScheduleSiteTour;
use App\Application\Appointment\UpdateAppointmentStatus;
use App\Domain\Agent\Contracts\AgentRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly ListAppointments $listAppointments,
        private readonly ScheduleSiteTour $scheduleSiteTour,
        private readonly UpdateAppointmentStatus $updateStatus,
    ) {}

    public function index(Request $request): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $perPage = (int) $request->query('per_page', 15);
        $appointments = $this->listAppointments->handle($agent->id, $perPage);

        return Inertia::render('Appointments/Index', [
            'appointments' => AppointmentResource::collection($appointments)->resolve(),
            'meta' => [
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ],
        ]);
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $this->scheduleSiteTour->handle($agent->id, $request->validated());

        return redirect()->route('appointments.index')->with('success', 'Appointment scheduled successfully.');
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:Appointment,Visited,Done,Did not Visit'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $this->updateStatus->handle(
            appointmentId: $id,
            agentId: $agent->id,
            status: $request->input('status'),
            notes: $request->input('notes'),
        );

        return back()->with('success', 'Appointment status updated.');
    }
}
