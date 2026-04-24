<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuyerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agent_id' => $this->agent_id,
            'buyer_type' => $this->buyer_type,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'middle_name' => $this->middle_name,
            'gender' => $this->gender,
            'civil_status' => $this->civil_status,
            'birth_date' => $this->birth_date?->toDateString(),
            'birth_place' => $this->birth_place,
            'nationality' => $this->nationality,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'present_address' => $this->present_address,
            'permanent_address' => $this->permanent_address,
            'tin' => $this->tin,
            'pag_ibig_id' => $this->pag_ibig_id,
            'sss_no' => $this->sss_no,
            'occupation' => $this->occupation,
            'employer' => $this->employer,
            'monthly_income' => $this->monthly_income,
            'source_of_income' => $this->source_of_income,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
