<?php

namespace App\Http\Controllers\Web;

use App\Application\Agent\GenerateAppointmentLink;
use App\Application\Agent\GenerateReferralLink;
use App\Application\Agent\GetDashboardStats;
use App\Application\Sales\ListAgentSales;
use App\Domain\Agent\Contracts\AgentRepository;
use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly GetDashboardStats $getDashboardStats,
        private readonly GenerateReferralLink $generateReferralLink,
        private readonly GenerateAppointmentLink $generateAppointmentLink,
        private readonly ListAgentSales $listSales,
    ) {}

    public function index(Request $request): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);

        $stats = $agent ? $this->getDashboardStats->handle($agent->id) : [];
        $referralCode = $agent ? $this->generateReferralLink->handle($agent->id)['code'] : null;
        $appointmentCode = $agent ? $this->generateAppointmentLink->handle($agent->id)['code'] : null;
        $referralLink = $referralCode ? 'https://marrea.ph/buyer/client-registration?referral_code=' . $referralCode : null;
        $appointmentLink = $appointmentCode ? 'https://marrea.ph/site-visit-appointment?appointment_ref_code=' . $appointmentCode : null;

        $sales = $agent ? SaleResource::collection($this->listSales->handle($agent->id, 100))->resolve() : [];

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'agent' => $agent,
            'referral_link' => $referralLink,
            'appointment_link' => $appointmentLink,
            'sales' => $sales,
        ]);
    }
}
