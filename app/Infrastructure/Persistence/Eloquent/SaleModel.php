<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SaleModel extends Model
{
    protected $table = 're_sales';

    protected $fillable = [
        'buyer_id',
        'agent_id',
        'project_id',
        'unit_id',
        'prepared_by_user_id',
        'reservation_date',
        'reservation_fee',
        'promo_code',
        'tcp',
        'tcp_vat',
        'discount',
        'dp_percentage',
        'dp_amount',
        'total_paid',
        'balance',
        'has_equity',
        'equity_net',
        'equity_terms',
        'monthly_equity',
        'equity_start_date',
        'equity_end_date',
        'financing_type',
        'financing_bank',
        'financing_amount',
        'status',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'reservation_fee' => 'decimal:2',
        'tcp' => 'decimal:2',
        'tcp_vat' => 'decimal:2',
        'discount' => 'decimal:2',
        'dp_percentage' => 'decimal:4',
        'dp_amount' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'balance' => 'decimal:2',
        'has_equity' => 'boolean',
        'equity_net' => 'decimal:2',
        'monthly_equity' => 'decimal:2',
        'equity_start_date' => 'date',
        'equity_end_date' => 'date',
        'financing_amount' => 'decimal:2',
    ];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(AgentModel::class, 'agent_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(BuyerModel::class, 'buyer_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class, 'project_id');
    }

    public function incentives(): HasMany
    {
        return $this->hasMany(IncentiveModel::class, 'sale_id');
    }
}
