<?php

namespace App\Domain\Agent\ValueObjects;

final class PersonalInfo
{
    public function __construct(
        public readonly string $firstName,
        public readonly string $lastName,
        public readonly ?string $middleName = null,
        public readonly ?string $gender = null,
        public readonly ?string $pagIbigId = null,
        public readonly ?string $tin = null,
    ) {}

    public function fullName(): string
    {
        return trim("{$this->firstName} {$this->middleName} {$this->lastName}");
    }
}
