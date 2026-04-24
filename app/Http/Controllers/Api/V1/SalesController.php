<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Sales\GetSaleDetails;
use App\Application\Sales\ListAgentSales;
use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function __construct(
        private readonly ListAgentSales $listSales,
        private readonly GetSaleDetails $getSale,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $perPage = (int) $request->query('per_page', 15);
        $sales = $this->listSales->handle($agent->id, $perPage);

        return response()->json([
            'data' => SaleResource::collection($sales),
            'meta' => [
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $agent = $request->get('_agent');
        $sale = $this->getSale->handle($id, $agent->id);

        return response()->json(new SaleResource($sale));
    }
}
