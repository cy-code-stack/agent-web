<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Agent\GenerateAppointmentLink;
use App\Application\Agent\GenerateReferralLink;
use App\Application\Agent\GetAgentProfile;
use App\Application\Agent\GetDashboardStats;
use App\Application\Agent\UpdateAgentProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Agent\UpdateAgentRequest;
use App\Http\Resources\AgentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function __construct(
        private readonly GetAgentProfile $getProfile,
        private readonly UpdateAgentProfile $updateProfile,
        private readonly GenerateReferralLink $generateReferralLink,
        private readonly GenerateAppointmentLink $generateAppointmentLink,
        private readonly GetDashboardStats $getDashboardStats,
    ) {}

    public function profile(Request $request): JsonResponse
    {
        $agent = $this->getProfile->handle($request->user()->id);

        if (! $agent) {
            return response()->json(['message' => 'Agent profile not found.'], 404);
        }

        return response()->json(new AgentResource($agent));
    }

    public function updateProfile(UpdateAgentRequest $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $updated = $this->updateProfile->handle($agent->id, $request->validated());

        return response()->json(new AgentResource($updated));
    }

    public function referralLink(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $result = $this->generateReferralLink->handle($agent->id);

        return response()->json($result);
    }

    public function appointmentLink(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $result = $this->generateAppointmentLink->handle($agent->id);

        return response()->json($result);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $stats = $this->getDashboardStats->handle($agent->id);

        return response()->json($stats);
    }
}
