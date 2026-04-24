<?php

namespace App\Domain\Incentive\Services;

use App\Domain\Shared\Money;

class IncentiveCalculationService
{
    public function calculateTotal(array $items): Money
    {
        $total = array_reduce(
            $items,
            fn (float $carry, array $item) => $carry + ($item['amount'] ?? 0),
            0.0,
        );

        return new Money($total);
    }
}
