<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_fname' => $this->client_fname,
            'client_lname' => $this->client_lname,
            'client_email' => $this->client_email,
            'client_contact_number' => $this->client_contact_number,
            'seller_name' => $this->seller_name,
            'appointment_date' => $this->sched_date?->toDateString(),
            'appointment_time' => $this->sched_time,
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
