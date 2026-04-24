<?php

namespace App\Domain\Agent\ValueObjects;

final class Address
{
    public function __construct(
        public readonly ?string $country = null,
        public readonly ?string $region = null,
        public readonly ?string $province = null,
        public readonly ?string $city = null,
        public readonly ?string $barangay = null,
        public readonly ?string $street = null,
        public readonly ?string $unit = null,
        public readonly ?string $buildingName = null,
        public readonly ?string $houseNo = null,
        public readonly ?string $subdivision = null,
        public readonly ?string $zipCode = null,
    ) {}
}
