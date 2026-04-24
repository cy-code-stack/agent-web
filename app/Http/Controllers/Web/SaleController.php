<?php

namespace App\Http\Controllers\Web;

use App\Application\Sales\GetSaleDetails;
use App\Application\Sales\ListAgentSales;
use App\Domain\Agent\Contracts\AgentRepository;
use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly ListAgentSales $listSales,
        private readonly GetSaleDetails $getSale,
    ) {}

    public function index(Request $request): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $perPage = (int) $request->query('per_page', 15);
        $sales = $this->listSales->handle($agent->id, $perPage);

        return Inertia::render('Sales/Index', [
            'sales' => SaleResource::collection($sales)->resolve(),
            'meta' => [
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage(),
                'per_page' => $sales->perPage(),
                'total' => $sales->total(),
            ],
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $sale = $this->getSale->handle($id, $agent->id);

        return Inertia::render('Sales/Show', [
            'sale' => (new SaleResource($sale))->resolve(),
        ]);
    }
}
