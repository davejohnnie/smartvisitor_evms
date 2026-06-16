<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    protected $primaryKey = 'v_id';

    protected $fillable = [
        'full_name',
        'phone_number',
        'id_number',
    ];

    // Relationships
    public function visits(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Visit::class, 'visitor_id', 'v_id');
    }
}