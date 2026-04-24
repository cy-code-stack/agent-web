<?php

namespace App\Domain\Agent\Services;

use App\Domain\Agent\Contracts\AgentRepository;

class AppointmentRefCodeService
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function generate(): string
    {
        do {
            $code = strtoupper(substr(md5(uniqid('apt_', true)), 0, 10));
        } while ($this->agentRepo->findByAppointmentRefCode($code) !== null);

        return $code;
    }

    public function buildLink(string $code, string $baseUrl): string
    {
        return rtrim($baseUrl, '/') . '?apt=' . $code;
    }
}
