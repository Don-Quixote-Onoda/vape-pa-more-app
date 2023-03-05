<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    public $table = 'order_details';
    public $primary_key = 'id';
    public $timestamp = true;

    protected $fillable = [
        'total_amount',
        'user_id',
        'order_number',
        'is_deleted'
    ];

    public function payment() {
        return $this->hasMany(Payment::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

}
