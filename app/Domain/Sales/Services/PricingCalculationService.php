<?php

namespace App\Domain\Sales\Services;

use App\Domain\Shared\Money;

class PricingCalculationService
{
    public function calculateDownPayment(float $tcp, float $dpPercentage): Money
    {
        return new Money(round($tcp * ($dpPercentage / 100), 2));
    }

    public function calculateBalance(float $tcp, float $totalPaid): Money
    {
        return new Money(max(0, round($tcp - $totalPaid, 2)));
    }

    public function calculateMonthlyEquity(float $equityNet, int $terms): Money
    {
        if ($terms <= 0) {
            return new Money(0);
        }

        return new Money(round($equityNet / $terms, 2));
    }
}
