<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Client\AddNewClient;
use App\Application\Client\ExportClientList;
use App\Application\Client\GetClientDetails;
use App\Application\Client\ListAgentClients;
use App\Application\Client\UpdateClientInfo;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Resources\BuyerCollection;
use App\Http\Resources\BuyerResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function __construct(
        private readonly ListAgentClients $listClients,
        private readonly GetClientDetails $getClient,
        private readonly AddNewClient $addClient,
        private readonly UpdateClientInfo $updateClient,
        private readonly ExportClientList $exportClients,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $clients = $this->listClients->handle($agent->id, $request->only([
            'search', 'per_page', 'sort_by', 'sort_order',
        ]));

        return response()->json(new BuyerCollection($clients));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $agent = $request->get('_agent');
        $buyer = $this->getClient->handle($id, $agent->id);

        return response()->json(new BuyerResource($buyer));
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $buyer = $this->addClient->handle($agent->id, $request->validated());

        return response()->json(new BuyerResource($buyer), 201);
    }

    public function update(StoreClientRequest $request, int $id): JsonResponse
    {
        $agent = $request->get('_agent');
        $buyer = $this->updateClient->handle($id, $agent->id, $request->validated());

        return response()->json(new BuyerResource($buyer));
    }

    public function export(Request $request): JsonResponse
    {
        $agent = $request->get('_agent');
        $clients = $this->exportClients->handle($agent->id);

        return response()->json(['data' => BuyerResource::collection($clients)]);
    }
}
