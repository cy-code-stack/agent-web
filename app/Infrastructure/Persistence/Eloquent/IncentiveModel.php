<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IncentiveModel extends Model
{
    protected $table = 'agent_incentives';

    protected $fillable = [
        'agent_id',
        'sale_id',
        'unit_id',
        'approved_by_user_id',
        'requested_by_user_id',
        'total_incentive',
        'status',
        'date_needed',
        'rfp_attachment',
        'remarks',
        'rejection_reason',
    ];

    protected $casts = [
        'total_incentive' => 'decimal:2',
        'date_needed' => 'date',
    ];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(AgentModel::class, 'agent_id');
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(SaleModel::class, 'sale_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(UnitModel::class, 'unit_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(IncentiveItemModel::class, 'agent_incentive_id');
    }
}
