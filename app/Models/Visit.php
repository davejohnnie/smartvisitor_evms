<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasFactory;

    protected $primaryKey = 'visit_id';

    protected $fillable = [
        'tenant_id',
        'visitor_id',
        'guard_id',
        'purpose',
        'qr_token',
        'visit_type',
        'status',
        'visit_date',
        'expected_time_in',
        'expected_time_out',
        'check_in',
        'check_out',
        'overstay_notified',
    ];

    protected function casts(): array
    {
        return [
            'check_in'           => 'datetime',
            'check_out'          => 'datetime',
            //'visit_date'         => 'date',
            'overstay_notified'  => 'boolean',
        ];
    }

    // Relationships
    public function tenant(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 't_id');
    }

    public function visitor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Visitor::class, 'visitor_id', 'v_id');
    }

    public function securityGuard(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Guard::class, 'guard_id', 'guard_id');
    }

    // Status helpers
    public function isPending(): bool    { return $this->status === 'pending'; }
    public function isCheckedIn(): bool  { return $this->status === 'checked-in'; }
    public function isCheckedOut(): bool { return $this->status === 'checked-out'; }
}