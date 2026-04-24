<?php

namespace App\Application\Auth;

use App\Domain\Agent\Contracts\AgentRepository;
use App\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginAgent
{
    public function __construct(private readonly AgentRepository $agentRepo) {}

    public function handle(string $email, string $password, string $deviceName = 'web'): array
    {
        $user = UserModel::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $agent = $this->agentRepo->findByUserId($user->id);

        $token = $user->createToken($deviceName)->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
            'agent' => $agent,
        ];
    }
}
