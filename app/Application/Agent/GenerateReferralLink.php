<?php

namespace App\Application\Agent;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Domain\Agent\Services\ReferralCodeService;

class GenerateReferralLink
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly ReferralCodeService $referralCodeService,
    ) {}

    public function handle(int $agentId): array
    {
        $agent = $this->agentRepo->findById($agentId);

        if (! $agent->referral_code) {
            $code = $this->referralCodeService->generate();
            $agent = $this->agentRepo->update($agentId, ['referral_code' => $code->value]);
        }

        $baseUrl = config('app.frontend_url', config('app.url')) . '/register';
        $link = $this->referralCodeService->buildLink($agent->referral_code, $baseUrl);

        return ['code' => $agent->referral_code, 'link' => $link];
    }
}
