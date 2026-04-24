<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AgentModel extends Model
{
    use SoftDeletes;

    protected $table = 're_agents';

    protected $fillable = [
        'user_id',
        'realty_id',
        'realty_manager_id',
        'referral_code',
        'appointment_ref_code',
        'first_name',
        'last_name',
        'middle_name',
        'gender',
        'contact_number',
        'agent_phone_num',
        'agent_landline',
        'agent_country',
        'agent_region',
        'agent_province',
        'agent_city_mul',
        'agent_brgy',
        'agent_street',
        'agent_zip_code',
        'is_institution',
        'pag_ibig_id',
        'tin',
        'email',
    ];

    protected $casts = [
        'is_institution' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    public function buyers(): HasMany
    {
        return $this->hasMany(BuyerModel::class, 'agent_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(SaleModel::class, 'agent_id');
    }

    public function incentives(): HasMany
    {
        return $this->hasMany(IncentiveModel::class, 'agent_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(AppointmentModel::class, 'realty_id', 'realty_id');
    }
}
