<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'middle_name' => $this->middle_name,
            'gender' => $this->gender,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'agent_phone_num' => $this->agent_phone_num,
            'agent_landline' => $this->agent_landline,
            'referral_code' => $this->referral_code,
            'appointment_ref_code' => $this->appointment_ref_code,
            'is_institution' => $this->is_institution,
            'address' => [
                'country' => $this->agent_country,
                'region' => $this->agent_region,
                'province' => $this->agent_province,
                'city' => $this->agent_city_mul,
                'barangay' => $this->agent_brgy,
                'street' => $this->agent_street,
                'zip_code' => $this->agent_zip_code,
            ],
            'pag_ibig_id' => $this->pag_ibig_id,
            'tin' => $this->tin,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
