<?php

namespace App\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectModel extends Model
{

protected $table = 'projects';

    protected $fillable = [
        'name',
        'description',
        'location',
        'type',
        'city',
        'status',
    ];

    public function units(): HasMany
    {
        return $this->hasMany(UnitModel::class, 'project_id');
    }
}
