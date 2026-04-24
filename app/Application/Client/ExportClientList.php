<?php

namespace App\Application\Client;

use App\Domain\Client\Contracts\BuyerRepository;
use Illuminate\Database\Eloquent\Collection;

class ExportClientList
{
    public function __construct(private readonly BuyerRepository $buyerRepo) {}

    public function handle(int $agentId): Collection
    {
        return $this->buyerRepo->allForAgent($agentId);
    }
}
