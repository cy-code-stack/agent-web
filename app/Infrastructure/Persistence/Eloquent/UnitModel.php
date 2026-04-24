<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitModel extends Model
{
    protected $table = 'vertical_project_units';

    protected $fillable = [
        'project_id',
        'unit_number',
        'block_number',
        'floor',
        'building',
        'unit_type',
        'area',
        'price',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'area' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectModel::class, 'project_id');
    }
}
