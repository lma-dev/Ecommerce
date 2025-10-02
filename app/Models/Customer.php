<?php

namespace App\Models;

use App\Notifications\Auth\CustomerResetPassword;
use App\Notifications\Auth\CustomerVerifyEmail;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable implements CanResetPasswordContract, MustVerifyEmailContract
{
    use HasApiTokens, Notifiable, HasFactory, SoftDeletes, CanResetPasswordTrait, MustVerifyEmailTrait;

    protected $fillable = ['name', 'email', 'password', 'account_status', 'phone'];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed'
        ];
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new CustomerResetPassword($token, request()?->input('locale')));
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomerVerifyEmail(request()?->input('locale')));
    }
}
