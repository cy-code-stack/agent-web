<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Auth\LoginAgent;
use App\Application\Auth\LogoutAgent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\AgentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly LoginAgent $loginAgent,
        private readonly LogoutAgent $logoutAgent,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->loginAgent->handle(
            email: $request->validated('email'),
            password: $request->validated('password'),
            deviceName: $request->validated('device_name', 'web'),
        );

        return response()->json([
            'token' => $result['token'],
            'user' => [
                'id' => $result['user']->id,
                'name' => $result['user']->name,
                'email' => $result['user']->email,
            ],
            'agent' => $result['agent'] ? new AgentResource($result['agent']) : null,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->logoutAgent->handle($request->user());

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
        ]);
    }
}
