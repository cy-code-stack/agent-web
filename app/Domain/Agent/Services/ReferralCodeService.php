<?php

namespace App\Domain\Agent\Services;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Domain\Agent\ValueObjects\ReferralCode;
use App\Infrastructure\Persistence\Eloquent\AgentModel;

class ReferralCodeService
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function generate(): ReferralCode
    {
        do {
            $code = ReferralCode::generate();
        } while ($this->agentRepo->findByReferralCode($code->value) !== null);

        return $code;
    }

    public function resolve(string $code): ?AgentModel
    {
        return $this->agentRepo->findByReferralCode($code);
    }

    public function buildLink(string $code, string $baseUrl): string
    {
        return (new ReferralCode($code))->buildLink($baseUrl);
    }
}
