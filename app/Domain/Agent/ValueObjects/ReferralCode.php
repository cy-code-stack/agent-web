<?php

namespace App\Domain\Agent\ValueObjects;

use InvalidArgumentException;

final class ReferralCode
{
    public function __construct(public readonly string $value)
    {
        if (empty(trim($value))) {
            throw new InvalidArgumentException('Referral code cannot be empty.');
        }
    }

    public static function generate(): self
    {
        return new self(strtoupper(substr(md5(uniqid('', true)), 0, 8)));
    }

    public function buildLink(string $baseUrl): string
    {
        return rtrim($baseUrl, '/') . '?ref=' . $this->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
