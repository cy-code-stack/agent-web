<?php

namespace App\Application\Client;

use App\Domain\Client\Contracts\BuyerRepository;
use App\Infrastructure\Persistence\Eloquent\BuyerModel;
use Illuminate\Support\Facades\Cache;

class AddNewClient
{
    public function __construct(private readonly BuyerRepository $buyerRepo) {}

    public function handle(int $agentId, array $data): BuyerModel
    {
        $buyer = new BuyerModel(array_merge($data, ['agent_id' => $agentId]));
        $result = $this->buyerRepo->save($buyer);

        Cache::forget("agent:{$agentId}:clients:*");

        return $result;
    }
}
