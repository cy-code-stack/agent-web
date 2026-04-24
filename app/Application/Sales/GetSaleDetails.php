<?php

namespace App\Application\Sales;

use App\Domain\Sales\Contracts\SaleRepository;
use App\Infrastructure\Persistence\Eloquent\SaleModel;
use Illuminate\Auth\Access\AuthorizationException;

class GetSaleDetails
{
    public function __construct(private readonly SaleRepository $saleRepo) {}

    public function handle(int $saleId, int $agentId): SaleModel
    {
        $sale = $this->saleRepo->findById($saleId);

        if (! $sale || $sale->agent_id !== $agentId) {
            throw new AuthorizationException('Sale not found or not accessible.');
        }

        return $sale;
    }
}
