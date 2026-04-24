<?php

namespace App\Http\Controllers\Web;

use App\Application\Incentive\GetIncentiveDetails;
use App\Application\Incentive\ListAgentIncentives;
use App\Domain\Agent\Contracts\AgentRepository;
use App\Http\Controllers\Controller;
use App\Http\Resources\IncentiveResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncentiveController extends Controller
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly ListAgentIncentives $listIncentives,
        private readonly GetIncentiveDetails $getIncentive,
    ) {}

    public function index(Request $request): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $perPage = (int) $request->query('per_page', 15);
        $incentives = $this->listIncentives->handle($agent->id, $perPage);

        return Inertia::render('Incentives/Index', [
            'incentives' => IncentiveResource::collection($incentives)->resolve(),
            'meta' => [
                'current_page' => $incentives->currentPage(),
                'last_page' => $incentives->lastPage(),
                'per_page' => $incentives->perPage(),
                'total' => $incentives->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $incentive = $this->getIncentive->handle($id, $agent->id);

        return Inertia::render('Incentives/Show', [
            'incentive' => (new IncentiveResource($incentive))->resolve(),
        ]);
    }
}
