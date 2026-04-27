<?php

namespace App\Application\Agent;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Infrastructure\Persistence\Eloquent\AppointmentModel;
use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use App\Infrastructure\Persistence\Eloquent\IncentiveModel;
use App\Infrastructure\Persistence\Eloquent\SaleModel;
use Illuminate\Support\Facades\Cache;

class GetDashboardStats
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function handle(int $agentId): array
    {
        return Cache::remember("agent:{$agentId}:dashboard", now()->addMinutes(10), function () use ($agentId) {
                $agent = $this->agentRepo->findById($agentId);

                return [
                    'total_clients' => BuyerModel::where('agent_id', $agentId)->count(),
                    'total_contract_price' => SaleModel::where('agent_id', $agentId)->sum('total_contract_price'),
                    'pending_incentives' => IncentiveModel::where('agent_id', $agentId)
                        ->where('status', 'pending')->count(),
                    'total_incentive_amount' => IncentiveModel::where('agent_id', $agentId)
                        ->where('status', 'approved')->sum('total_incentive'),
                    'upcoming_appointments' => AppointmentModel::where('realty_id', $agent?->realty_id)
                        ->where('sched_date', '>=', now()->toDateString())
                        ->where('status', 'Appointment')
                        ->count(),
                ];
            });
    }
}
