<?php

namespace App\Application\Auth;

use App\Infrastructure\Persistence\Eloquent\UserModel;

class LogoutAgent
{
    public function handle(UserModel $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
