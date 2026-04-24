<?php

namespace App\Http\Controllers\Web;

use App\Application\Client\AddNewClient;
use App\Application\Client\GetClientDetails;
use App\Application\Client\ListAgentClients;
use App\Application\Client\UpdateClientInfo;
use App\Domain\Agent\Contracts\AgentRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Resources\BuyerResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function __construct(
        private readonly AgentRepository $agentRepo,
        private readonly ListAgentClients $listClients,
        private readonly GetClientDetails $getClient,
        private readonly AddNewClient $addClient,
        private readonly UpdateClientInfo $updateClient,
    ) {}

    public function index(Request $request): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $clients = $this->listClients->handle($agent->id, $request->only([
            'search', 'per_page', 'sort_by', 'sort_order',
        ]));

        return Inertia::render('Clients/Index', [
            'clients' => BuyerResource::collection($clients)->resolve(),
            'meta' => [
                'current_page' => $clients->currentPage(),
                'last_page' => $clients->lastPage(),
                'per_page' => $clients->perPage(),
                'total' => $clients->total(),
            ],
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $client = $this->getClient->handle($id, $agent->id);

        return Inertia::render('Clients/Show', [
            'client' => (new BuyerResource($client))->resolve(),
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $this->addClient->handle($agent->id, $request->validated());

        return redirect()->route('clients.index')->with('success', 'Client added successfully.');
    }

    public function update(StoreClientRequest $request, int $id): RedirectResponse
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $this->updateClient->handle($id, $agent->id, $request->validated());

        return back()->with('success', 'Client updated successfully.');
    }
}
