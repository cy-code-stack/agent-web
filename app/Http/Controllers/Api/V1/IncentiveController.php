<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Incentive\GetIncentiveDetails;
use App\Application\Incentive\ListAgentIncentives;
use App\Http\Controllers\Controller;
use App\Http\Resources\IncentiveResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IncentiveController extends Controller
{
    public function __construct(
        private readonly ListAgentIncentives $listIncentives,
        private readonly GetIncentiveDetails $getIncentive,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $perPage = (int) $request->query('per_page', 15);
        $incentives = $this->listIncentives->handle($agent->id, $perPage);

        return response()->json([
            'data' => IncentiveResource::collection($incentives),
            'meta' => [
                'current_page' => $incentives->currentPage(),
                'last_page' => $incentives->lastPage(),
                'per_page' => $incentives->perPage(),
                'total' => $incentives->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $agent = $request->get('_agent');
        $incentive = $this->getIncentive->handle($id, $agent->id);

        return response()->json(new IncentiveResource($incentive));
    }
}
