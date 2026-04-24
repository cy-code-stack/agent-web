<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentModel extends Model
{

    protected $table = 'site_tour_appointments';

    protected $fillable = [
        'realty_id',
        'non_realty',
        'project_location',
        'seller_name',
        'seller_contact_number',
        'seller_email',
        'client_fname',
        'client_lname',
        'client_contact_number',
        'client_email',
        'client_address',
        'sched_date',
        'scheduled_time',
        'transportation_type',
        'pickup_location',
        'pickup_time',
        'pre_approval_status',
        'pre_approval_monthly_amort',
        'status',
        'reason_for_not_attending',
        'notes',
    ];

    protected $casts = [
        'sched_date' => 'date',
        'pre_approval_monthly_amort' => 'decimal:2',
    ];

    public function realty(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class, 'realty_id');
    }
}
