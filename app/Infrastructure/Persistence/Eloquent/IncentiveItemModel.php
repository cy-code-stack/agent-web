<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncentiveItemModel extends Model
{
    protected $table = 'agent_incentive_items';

    protected $fillable = [
        'incentive_id',
        'incentive_type',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function incentive(): BelongsTo
    {
        return $this->belongsTo(IncentiveModel::class, 'incentive_id');
    }
}
