<?php

namespace App\Application\Agent;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Domain\Agent\Services\AppointmentRefCodeService;

class GenerateAppointmentLink
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly AppointmentRefCodeService $aptCodeService,
    ) {}

    public function handle(int $agentId): array
    {
        $agent = $this->agentRepo->findById($agentId);

        if (! $agent->appointment_ref_code) {
            $code = $this->aptCodeService->generate();
            $agent = $this->agentRepo->update($agentId, ['appointment_ref_code' => $code]);
        }

        $baseUrl = config('app.frontend_url', config('app.url')) . '/schedule';
        $link = $this->aptCodeService->buildLink($agent->appointment_ref_code, $baseUrl);

        return ['code' => $agent->appointment_ref_code, 'link' => $link];
    }
}
