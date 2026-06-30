<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'u_id';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function tenant(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Tenant::class, 'u_id', 'u_id');
    }

    public function securityGuard(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Guard::class, 'u_id', 'u_id');
    }

    public function resolvedIncidents(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Incident::class, 'resolved_by', 'u_id');
    }

    // Role helpers — we'll use these everywhere
    public function isTenant(): bool
    {
        return $this->role === 'tenant';
    }
    public function isGuard(): bool
    {
        return $this->role === 'guard';
    }
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }
    public function notifications(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Notification::class, 'u_id', 'u_id');
    }
}
