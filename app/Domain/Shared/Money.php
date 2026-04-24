<?php

namespace App\Domain\Shared;

use InvalidArgumentException;

final class Money
{
    public function __construct(
        public readonly float $amount,
        public readonly string $currency = 'PHP',
    ) {
        if ($amount < 0) {
            throw new InvalidArgumentException('Amount cannot be negative.');
        }
    }

    public function add(Money $other): self
    {
        return new self($this->amount + $other->amount, $this->currency);
    }

    public function format(): string
    {
        return number_format($this->amount, 2);
    }

    public function toArray(): array
    {
        return ['amount' => $this->amount, 'currency' => $this->currency];
    }
}
