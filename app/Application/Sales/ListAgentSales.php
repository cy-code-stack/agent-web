<?php

namespace App\Application\Sales;

use App\Domain\Sales\Contracts\SaleRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ListAgentSales
{
    public function __construct(private readonly SaleRepository $saleRepo) {}

    public function handle(int $agentId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->saleRepo->findByAgent($agentId, $perPage);
    }
}
