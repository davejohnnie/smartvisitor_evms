<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $primaryKey = 'i_id';

    protected $fillable = [
        'tenant_id',
        'resolved_by',
        'type',
        'severity',
        'title',
        'details',
        'status',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
        ];
    }

    // Relationships
    public function tenant(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 't_id');
    }

    public function resolvedBy(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by', 'u_id');
    }

    // Status helpers
    public function isPending(): bool  { return $this->status === 'pending'; }
    public function isResolved(): bool { return $this->status === 'resolved'; }
}