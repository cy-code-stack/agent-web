<?php

namespace App\Application\Client;

use App\Domain\Client\Contracts\BuyerRepository;
use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Cache;

class UpdateClientInfo
{
    public function __construct(private readonly BuyerRepository $buyerRepo) {}

    public function handle(int $buyerId, int $agentId, array $data): BuyerModel
    {
        $buyer = $this->buyerRepo->findById($buyerId);

        if (! $buyer || $buyer->agent_id !== $agentId) {
            throw new AuthorizationException('Client not found or not accessible.');
        }

        $updated = $this->buyerRepo->update($buyerId, $data);

        Cache::forget("agent:{$agentId}:clients:*");

        return $updated;
    }
}
