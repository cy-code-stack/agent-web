<?php

namespace App\Http\Controllers\Web;

use App\Application\Agent\GetAgentProfile;
use App\Application\Agent\UpdateAgentProfile;
use App\Domain\Agent\Contracts\AgentRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\Agent\UpdateAgentRequest;
use App\Http\Resources\AgentResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly GetAgentProfile $getProfile,
        private readonly UpdateAgentProfile $updateProfile,
        private readonly AgentRepository $agentRepo,
    ) {}

    public function index(Request $request): Response
    {
        $agent = $this->getProfile->handle($request->user()->id);

        return Inertia::render('Profile/Index', [
            'agent' => $agent ? (new AgentResource($agent))->resolve() : null,
        ]);
    }

    public function update(UpdateAgentRequest $request): RedirectResponse
    {
        $agent = $this->agentRepo->findByUserId($request->user()->id);
        $this->updateProfile->handle($agent->id, $request->validated());

        return back()->with('success', 'Profile updated successfully.');
    }
}
