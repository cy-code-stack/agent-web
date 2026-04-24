<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BuyerModel extends Model
{
    protected $table = 're_buyers';

    protected $fillable = [
        'agent_id',
        'user_id',
        'buyer_type',
        'first_name',
        'last_name',
        'middle_name',
        'gender',
        'civil_status',
        'birth_date',
        'birth_place',
        'nationality',
        'email',
        'contact_number',
        'present_address',
        'permanent_address',
        'tin',
        'pag_ibig_id',
        'sss_no',
        'occupation',
        'employer',
        'monthly_income',
        'source_of_income',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'monthly_income' => 'decimal:2',
    ];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(AgentModel::class, 'agent_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(SaleModel::class, 'buyer_id');
    }
}
