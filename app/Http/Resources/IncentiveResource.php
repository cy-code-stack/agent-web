<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncentiveResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agent_id' => $this->agent_id,
            'sale_id' => $this->sale_id,
            'client_name' => $this->whenLoaded('sale', fn () =>
                $this->sale->relationLoaded('buyer') && $this->sale->buyer
                    ? trim("{$this->sale->buyer->first_name} {$this->sale->buyer->last_name}")
                    : null
            ),
            'unit_id' => $this->unit_id,
            'total_incentive' => $this->total_incentive,
            'status' => $this->status,
            'date_needed' => $this->date_needed?->toDateString(),
            'rfp_attachment' => $this->rfp_attachment,
            'remarks' => $this->remarks,
            'rejection_reason' => $this->rejection_reason,
            'unit' => $this->whenLoaded('unit', fn () => [
                'unit_number'  => $this->unit->unit_number,
                'block_number' => $this->unit->block_number,
                'floor'        => $this->unit->floor,
                'building'     => $this->unit->building,
                'project'      => $this->unit->relationLoaded('project') ? [
                    'name' => $this->unit->project?->name,
                ] : null,
            ]),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'incentive_type' => $item->incentive_type,
                'amount' => $item->amount,
            ])),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
