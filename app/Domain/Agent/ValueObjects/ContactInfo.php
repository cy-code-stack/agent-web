<?php

namespace App\Domain\Agent\ValueObjects;

final class ContactInfo
{
    public function __construct(
        public readonly ?string $phone = null,
        public readonly ?string $landline = null,
        public readonly ?string $email = null,
    ) {}
}
