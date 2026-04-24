<?php

namespace App\Application\Client;

use App\Domain\Client\Contracts\BuyerRepository;
use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use Illuminate\Auth\Access\AuthorizationException;

class GetClientDetails
{
    public function __construct(private readonly BuyerRepository $buyerRepo) {}

    public function handle(int $buyerId, int $agentId): BuyerModel
    {
        $buyer = $this->buyerRepo->findById($buyerId);

        if (! $buyer || $buyer->agent_id !== $agentId) {
            throw new AuthorizationException('Client not found or not accessible.');
        }

        return $buyer;
    }
}
