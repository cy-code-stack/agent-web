<?php

namespace App\Http\Middleware;

use App\Domain\Agent\Contracts\AgentRepository;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAgentOwnership
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $agent = $this->agentRepo->findByUserId($user->id);

        if (! $agent) {
            return response()->json(['message' => 'Agent profile not found.'], 403);
        }

        $request->merge(['_agent' => $agent]);

        return $next($request);
    }
}
