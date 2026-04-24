<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agent_id' => $this->agent_id,
            'buyer_id' => $this->buyer_id,
            'project_id' => $this->project_id,
            'unit_id' => $this->unit_id,
            'status' => $this->status,
            'reservation' => [
                'date' => $this->reservation_date?->toDateString(),
                'fee' => $this->reservation_fee,
                'promo_code' => $this->promo_code,
            ],
            'pricing' => [
                'tcp' => $this->tcp,
                'tcp_vat' => $this->tcp_vat,
                'discount' => $this->discount,
                'dp_percentage' => $this->dp_percentage,
                'dp_amount' => $this->dp_amount,
                'total_paid' => $this->total_paid,
                'balance' => $this->balance,
            ],
            'equity' => [
                'has_equity' => $this->has_equity,
                'equity_net' => $this->equity_net,
                'equity_terms' => $this->equity_terms,
                'monthly_equity' => $this->monthly_equity,
                'start_date' => $this->equity_start_date?->toDateString(),
                'end_date' => $this->equity_end_date?->toDateString(),
            ],
            'financing' => [
                'type' => $this->financing_type,
                'bank' => $this->financing_bank,
                'amount' => $this->financing_amount,
            ],
            'buyer' => $this->whenLoaded('buyer', fn () => [
                'id'           => $this->buyer->id,
                'first_name'   => $this->buyer->first_name,
                'last_name'    => $this->buyer->last_name,
                'email'        => $this->buyer->email,
                'buyer_type'   => $this->buyer->buyer_type,
                'contact_number' => $this->buyer->contact_number,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
